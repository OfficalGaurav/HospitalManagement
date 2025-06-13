export class Billing {
  id: number = 0; // Unique identifier for the billing record
  patientId: number = 0; // ID of the patient associated with the billing record
  amount: number = 0; // The total amount to be billed
  date: Date = new Date(); // The date when the billing record was created
  status: string = ""; // The status of the billing (e.g., "Pending", "Paid", "Cancelled")

  constructor(
    id: number = 0,
    patientId: number = 0,
    amount: number = 0,
    date: Date = new Date(),
    status: string = ""
  ) {
    this.id = id;
    this.patientId = patientId;
    this.amount = amount;
    this.date = date;
    this.status = status;
  } 
}