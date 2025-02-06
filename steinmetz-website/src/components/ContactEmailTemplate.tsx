import * as React from 'react';

interface ContactEmailTemplateProps {
  firstName: string;
  lastName: string;
  email: string;
  companyName: string;
  jobTitle: string;
  companyHeadquarters: string;
  companySize: string;
  usageDetails: string;
}

export const ContactEmailTemplate: React.FC<Readonly<ContactEmailTemplateProps>> = ({
  firstName,
  lastName,
  email,
  companyName,
  jobTitle,
  companyHeadquarters,
  companySize,
  usageDetails,
}) => (
  <div>
    <h1>New Contact Form Submission</h1>
    
    <h2>Contact Details</h2>
    <p><strong>Name:</strong> {firstName} {lastName}</p>
    <p><strong>Email:</strong> {email}</p>
    
    <h2>Company Information</h2>
    <p><strong>Company:</strong> {companyName}</p>
    <p><strong>Job Title:</strong> {jobTitle}</p>
    <p><strong>Company HQ:</strong> {companyHeadquarters}</p>
    <p><strong>Unit Volume:</strong> {companySize}</p>
    
    <h2>Interest Details</h2>
    <p><strong>Usage Details:</strong> {usageDetails}</p>
  </div>
); 