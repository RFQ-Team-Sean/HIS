import { Injectable } from '@angular/core';
import { SupabaseService } from 'src/app/Supabase/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeeIdService {
  private static readonly PREFIX = 'EMP';
  private static readonly YEAR = new Date().getFullYear().toString().slice(-2);
  private static readonly SEQUENCE_LENGTH = 4;

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Generates a fixed-format employee ID
   * Format: EMP-YYYY-XXXX (e.g., EMP-24-0001)
   * @returns Promise resolving to the generated employee ID
   */
  async generateEmployeeId(): Promise<string> {
    try {
      // Fetch the last used sequence number
      const lastSequenceNumber = await this.getLastSequenceNumber();
      
      // Increment the sequence
      const newSequenceNumber = lastSequenceNumber + 1;
      
      // Save the new sequence number
      await this.saveSequenceNumber(newSequenceNumber);
      
      // Generate the formatted ID
      return this.formatEmployeeId(newSequenceNumber);
    } catch (error) {
      console.error('Error generating employee ID:', error);
      throw error;
    }
  }

  /**
   * Formats the employee ID with prefix, year, and padded sequence
   * @param sequenceNumber Numeric sequence for the ID
   * @returns Formatted employee ID string
   */
  private formatEmployeeId(sequenceNumber: number): string {
    const paddedSequence = this.padNumber(
      sequenceNumber, 
      EmployeeIdService.SEQUENCE_LENGTH
    );
    return `${EmployeeIdService.PREFIX}-${EmployeeIdService.YEAR}-${paddedSequence}`;
  }

  /**
   * Pads a number with leading zeros
   * @param num Number to pad
   * @param length Desired total length
   * @returns Padded number as string
   */
  private padNumber(num: number, length: number): string {
    return num.toString().padStart(length, '0');
  }

  /**
   * Retrieves the last used sequence number from Supabase
   * @returns Promise resolving to the last sequence number
   */
  private async getLastSequenceNumber(): Promise<number> {
    const { data, error } = await this.supabaseService.getEmployeeSequence();
    
    if (error) {
      console.error('Error fetching last sequence:', error);
      return 0; // Default to 0 if no sequence found
    }
    
    return data?.last_sequence || 0;
  }

  /**
   * Saves the new sequence number to Supabase
   * @param sequenceNumber New sequence number to save
   */
  private async saveSequenceNumber(sequenceNumber: number): Promise<void> {
    const { error } = await this.supabaseService.updateEmployeeSequence(sequenceNumber);
    
    if (error) {
      console.error('Error saving sequence number:', error);
      throw error;
    }
  }
}