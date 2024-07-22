import React, { useState } from 'react';
import axios from 'axios';
import './AddPerson.css';

const AddPerson = () => {
  const [name, setName] = useState('');
  const [pin, setPin] = useState('');
  const [emails, setEmails] = useState([{ emailType: 'PRSN', emailAddress: '' }]);
  const [addresses, setAddresses] = useState([{ addressType: 'HOME', addressInfo: '' }]);
  const [errorMessage, setErrorMessage] = useState('');

  const emailTypes = ['PRSN', 'WORK', 'NEWS', 'PROMO', 'SPAM'];
  const addressTypes = ['HOME', 'WORK', 'BILL', 'SHIP', 'TEMP'];

  const handleAddEmail = () => {
    setEmails([...emails, { emailType: 'PRSN', emailAddress: '' }]);
  };

  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  const handleAddAddress = () => {
    setAddresses([...addresses, { addressType: 'HOME', addressInfo: '' }]);
  };

  const handleRemoveAddress = (index) => {
    const newAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(newAddresses);
  };

  const handleSubmit = async () => {
    const data = {
      name,
      pin,
      mails: emails,
      addresses: addresses,
    };

    try {
      const response = await axios.post('http://localhost:8080/people', data);
      console.log('Person created:', response.data);
      // Reset form fields
      setName('');
      setPin('');
      setEmails([{ emailType: 'PRSN', emailAddress: '' }]);
      setAddresses([{ addressType: 'HOME', addressInfo: '' }]);
      setErrorMessage(''); // Clear error message on success
    } catch (error) {
      console.error('Error creating person:', error);
      if (error.response && error.response.data) {
        // Capture and set error message from backend
        setErrorMessage(error.response.data.message);
      } else {
        // Set a generic error message
        setErrorMessage('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="add-person-container">
      <h1>Add Person</h1>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>PIN:</label>
        <input
          type="text"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
        />
      </div>

      <h2>Emails</h2>
      {emails.map((email, index) => (
        <div key={index} className="form-group">
          <input
            type="text"
            value={email.emailAddress}
            onChange={(e) => {
              const newEmails = [...emails];
              newEmails[index].emailAddress = e.target.value;
              setEmails(newEmails);
            }}
            placeholder="Enter email address"
          />
          <select
            value={email.emailType}
            onChange={(e) => {
              const newEmails = [...emails];
              newEmails[index].emailType = e.target.value;
              setEmails(newEmails);
            }}
          >
            {emailTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button onClick={() => handleRemoveEmail(index)}>Remove Email</button>
        </div>
      ))}
      <button onClick={handleAddEmail}>Add Another Email</button>

      <h2>Addresses</h2>
      {addresses.map((address, index) => (
        <div key={index} className="form-group">
          <input
            type="text"
            value={address.addressInfo}
            onChange={(e) => {
              const newAddresses = [...addresses];
              newAddresses[index].addressInfo = e.target.value;
              setAddresses(newAddresses);
            }}
            placeholder="Enter address info"
          />
          <select
            value={address.addressType}
            onChange={(e) => {
              const newAddresses = [...addresses];
              newAddresses[index].addressType = e.target.value;
              setAddresses(newAddresses);
            }}
          >
            {addressTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <button onClick={() => handleRemoveAddress(index)}>Remove Address</button>
        </div>
      ))}
      <button onClick={handleAddAddress}>Add Another Address</button>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default AddPerson;
