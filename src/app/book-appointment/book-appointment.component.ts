import { Component, ElementRef, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StripeService } from 'ngx-stripe';
import { StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { DoctorService } from '../services/doctor.service';
import { Doctor } from '../doctor';
import { PatientService } from '../patient.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit, AfterViewInit {
  @ViewChild('cardElement') cardElement!: ElementRef;
  doctors: Doctor[] = [];
  selectedDoctor: Doctor | null = null;
  appointmentTime: string = '';
  errorMessage: string = '';
  isLoading = false;
  stripeCard: any;
  elements: any;

  // Stripe Elements
  stripeForm: FormGroup;
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    }
  };
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  constructor(
    private doctorService: DoctorService,
    private patientService: PatientService,
    private router: Router,
    private stripeService: StripeService,
    private fb: FormBuilder
  ) {
    this.stripeForm = this.fb.group({
      name: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.fetchDoctors();
  }

  ngAfterViewInit(): void {
    this.setupStripeElements();
  }

  setupStripeElements(): void {
    this.stripeService.elements(this.elementsOptions)
      .subscribe({
        next: elements => {
          this.elements = elements;
          // Create and mount the card element
          this.stripeCard = elements.create('card', this.cardOptions);
          
          // Check if the element exists before mounting
          if (this.cardElement?.nativeElement) {
            this.stripeCard.mount(this.cardElement.nativeElement);
          } else {
            console.error('Card element not found in DOM');
            this.errorMessage = 'Payment system initialization failed. Please refresh the page.';
          }
        },
        error: err => {
          console.error('Failed to initialize Stripe elements:', err);
          this.errorMessage = 'Payment system initialization failed. Please refresh the page.';
        }
      });
  }

  fetchDoctors(): void {
    this.doctorService.getDoctorList().subscribe(
      (data: Doctor[]) => {
        this.doctors = data;
      },
      (error) => {
        this.errorMessage = 'Failed to fetch doctors. Please try again.';
      }
    );
  }

  selectDoctor(doctor: Doctor): void {
    this.selectedDoctor = doctor;
  }

  async bookAppointment(): Promise<void> {
    if (!this.selectedDoctor || !this.appointmentTime || this.stripeForm.invalid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      // 1. Verify Stripe card is properly mounted
      if (!this.stripeCard) {
        throw new Error('Payment system not ready. Please try again.');
      }

      // 2. Create payment intent
      const paymentIntent = await this.patientService.createPaymentIntent().toPromise();
      
      if (!paymentIntent?.clientSecret) {
        throw new Error('Failed to initialize payment');
      }

      // 3. Confirm payment - use the mounted card element directly
      const result = await this.stripeService.confirmCardPayment(
        paymentIntent.clientSecret,
        {
          payment_method: {
            card: this.stripeCard,
            billing_details: {
              name: this.stripeForm.get('name')?.value || 'Anonymous'
            }
          }
        }
      ).toPromise();

      if (!result) {
        throw new Error('Payment confirmation failed');
      }

      if (result.error) {
        throw result.error;
      }

      if (!result.paymentIntent || result.paymentIntent.status !== 'succeeded') {
        throw new Error('Payment not completed');
      }

      // 4. Book appointment
      const appointmentTime = new Date(this.appointmentTime).getTime();
      await this.patientService.bookAppointment(
        this.selectedDoctor.id,
        appointmentTime,
        result.paymentIntent.id
      ).toPromise();

      // 5. Redirect to patient dashboard
      this.router.navigate(['/patient-dashboard']);
    } catch (err: unknown) {
      console.error('Booking error:', err);
      
      // Handle different error types safely
      if (err instanceof Error) {
        if (err.message.includes('specified Element')) {
          this.errorMessage = 'Payment system error. Please refresh the page and try again.';
          // Reinitialize Stripe elements
          this.setupStripeElements();
        } else {
          this.errorMessage = err.message || 'Payment failed. Please try again.';
        }
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      this.isLoading = false;
    }
  }
}