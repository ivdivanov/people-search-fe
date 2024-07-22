import React, { useState } from 'react';
import axios from 'axios';
import './People.css';

const emailTypes = ['PRSN', 'WORK', 'NEWS', 'PROMO', 'SPAM'];
const addressTypes = ['HOME', 'WORK', 'BILL', 'SHIP', 'TEMP'];

function People() {
  const [people, setPeople] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const [updateValue, setUpdateValue] = useState('');
  const [currentPerson, setCurrentPerson] = useState(null);
  const [currentEmail, setCurrentEmail] = useState(null);
  const [selectedEmailType, setSelectedEmailType] = useState(emailTypes[0]);
  const [currentAddress, setCurrentAddress] = useState(null);
  const [selectedAddressType, setSelectedAddressType] = useState(addressTypes[0]);

  // Function to handle search operation
  const handleSearch = () => {
    setError(null);
    axios.get(`http://localhost:8080/people?name=${searchQuery}`)
      .then(response => {
        setPeople([response.data]);
        setCurrentPerson(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error.response || error.message);
        setError(error.response?.data?.message || 'Error fetching data. Please try again.');
        setPeople([]);
      });
  };

  // Function to handle updating the PIN
  const handleUpdatePin = () => {
    if (!currentPerson) return;

    const updatedPerson = { ...currentPerson, pin: updateValue };

    axios.put('http://localhost:8080/people', updatedPerson)
      .then(response => {
        console.log('Update successful:', response.data);
        handleSearch();
        setEditMode(null);
        setUpdateValue('');
        setError(null);
      })
      .catch(error => {
        console.error('Error updating data:', error.response || error.message);
        setError(error.response?.data?.message || 'Error updating data. Please try again.');
      });
  };

  // Function to handle creating a new email
  const handleCreateEmail = () => {
    if (!currentPerson) return;

    const newEmail = { emailAddress: updateValue, emailType: selectedEmailType, personId: currentPerson.id };

    axios.post(`http://localhost:8080/mails?personId=${currentPerson.id}`, newEmail)
      .then(response => {
        console.log('Email created:', response.data);
        handleSearch();
        setEditMode(null);
        setUpdateValue('');
        setError(null);
      })
      .catch(error => {
        console.error('Error creating email:', error.response || error.message);
        setError(error.response?.data?.message || 'Error creating email. Please try again.');
      });
  };

  // Function to handle updating an email
  const handleUpdateEmail = (email) => {
    if (!currentPerson) return;

    const updatedEmail = { ...email, emailAddress: updateValue, emailType: selectedEmailType };

    axios.put(`http://localhost:8080/mails?personId=${currentPerson.id}&mailId=${email.id}`, updatedEmail)
      .then(response => {
        console.log('Email updated:', response.data);
        handleSearch();
        setEditMode(null);
        setUpdateValue('');
        setError(null);
      })
      .catch(error => {
        console.error('Error updating email:', error.response || error.message);
        setError(error.response?.data?.message || 'Error updating email. Please try again.');
      });
  };

  // Function to handle deleting an email
  const handleDeleteEmail = (emailId) => {
    axios.delete(`http://localhost:8080/mails?mailId=${emailId}`)
      .then(response => {
        console.log('Email deleted:', response.data);
        handleSearch();
        setError(null);
      })
      .catch(error => {
        console.error('Error deleting email:', error.response || error.message);
        setError(error.response?.data?.message || 'Error deleting email. Please try again.');
      });
  };

  // Function to handle creating a new address
  const handleCreateAddress = () => {
    if (!currentPerson) return;

    const newAddress = { addressInfo: updateValue, addressType: selectedAddressType, personId: currentPerson.id };

    axios.post(`http://localhost:8080/addresses?personId=${currentPerson.id}`, newAddress)
      .then(response => {
        console.log('Address created:', response.data);
        handleSearch();
        setEditMode(null);
        setUpdateValue('');
        setError(null);
      })
      .catch(error => {
        console.error('Error creating address:', error.response || error.message);
        setError(error.response?.data?.message || 'Error creating address. Please try again.');
      });
  };

  // Function to handle updating an address
  const handleUpdateAddress = (address) => {
    if (!currentPerson) return;

    const updatedAddress = { ...address, addressInfo: updateValue, addressType: selectedAddressType };

    axios.put(`http://localhost:8080/addresses?personId=${currentPerson.id}&addressId=${address.id}`, updatedAddress)
      .then(response => {
        console.log('Address updated:', response.data);
        handleSearch();
        setEditMode(null);
        setUpdateValue('');
        setError(null);
      })
      .catch(error => {
        console.error('Error updating address:', error.response || error.message);
        setError(error.response?.data?.message || 'Error updating address. Please try again.');
      });
  };

  // Function to handle deleting an address
  const handleDeleteAddress = (addressId) => {
    axios.delete(`http://localhost:8080/addresses?addressId=${addressId}`)
      .then(response => {
        console.log('Address deleted:', response.data);
        handleSearch();
        setError(null);
      })
      .catch(error => {
        console.error('Error deleting address:', error.response || error.message);
        setError(error.response?.data?.message || 'Error deleting address. Please try again.');
      });
  };

  // Function to handle deleting a person
  const handleDelete = () => {
    if (!currentPerson) return;

    axios.delete(`http://localhost:8080/people?name=${currentPerson.name}`)
      .then(response => {
        console.log('Delete successful:', response.data);
        setPeople([]);
        setCurrentPerson(null);
        setError(null);
      })
      .catch(error => {
        console.error('Error deleting person:', error.response || error.message);
        setError(error.response?.data?.message || 'Error deleting person. Please try again.');
      });
  };

  return (
    <div className="container">
      <h1>People</h1>
      <div className="search-container">
        <input 
          type="text" 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          placeholder="Search by name"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {error && <div className="error">{error}</div>}
      {people.length > 0 && people.map(person => (
        <div key={person.id} className="person-info">
          <h2>{person.name}</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {person.mails.map(mail => (
                <tr key={mail.id}>
                  <td>Email ({mail.emailType})</td>
                  <td>{mail.emailAddress || 'N/A'}</td>
                  <td>
                    <button onClick={() => { setEditMode('editEmail'); setCurrentEmail(mail); setSelectedEmailType(mail.emailType); }}>Edit</button>
                    <button onClick={() => handleDeleteEmail(mail.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              {person.addresses.map(address => (
                <tr key={address.id}>
                  <td>Address ({address.addressType})</td>
                  <td>{address.addressInfo || 'N/A'}</td>
                  <td>
                    <button onClick={() => { setEditMode('editAddress'); setCurrentAddress(address); setSelectedAddressType(address.addressType); }}>Edit</button>
                    <button onClick={() => handleDeleteAddress(address.id)}>Delete</button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>PIN</td>
                <td>{person.pin}</td>
                <td>
                  <button onClick={() => { setEditMode('pin'); setCurrentPerson(person); }}>Edit PIN</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="actions">
            <button onClick={() => { setEditMode('createEmail'); setCurrentPerson(person); }}>Add Email</button>
            <button onClick={() => { setEditMode('createAddress'); setCurrentPerson(person); }}>Add Address</button>
            <button onClick={handleDelete}>Delete Person</button>
          </div>
          {editMode === 'pin' && (
            <div className="edit-form">
              <input 
                type="text" 
                value={updateValue} 
                onChange={(e) => setUpdateValue(e.target.value)} 
                placeholder="Enter new PIN"
              />
              <button onClick={handleUpdatePin}>Submit</button>
              <button onClick={() => { setEditMode(null); setUpdateValue(''); setCurrentPerson(null); }}>Cancel</button>
            </div>
          )}
          {editMode === 'editEmail' && (
            <div className="edit-form">
              <input 
                type="text" 
                value={updateValue} 
                onChange={(e) => setUpdateValue(e.target.value)} 
                placeholder="Enter new email address"
              />
              <select 
                value={selectedEmailType} 
                onChange={(e) => setSelectedEmailType(e.target.value)}
              >
                {emailTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <button onClick={() => handleUpdateEmail(currentEmail)}>Update Email</button>
              <button onClick={() => { setEditMode(null); setUpdateValue(''); setCurrentEmail(null); }}>Cancel</button>
            </div>
          )}
          {editMode === 'editAddress' && (
            <div className="edit-form">
              <input 
                type="text" 
                value={updateValue} 
                onChange={(e) => setUpdateValue(e.target.value)} 
                placeholder="Enter new address info"
              />
              <select 
                value={selectedAddressType} 
                onChange={(e) => setSelectedAddressType(e.target.value)}
              >
                {addressTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <button onClick={() => handleUpdateAddress(currentAddress)}>Update Address</button>
              <button onClick={() => { setEditMode(null); setUpdateValue(''); setCurrentAddress(null); }}>Cancel</button>
            </div>
          )}
          {editMode === 'createEmail' && (
            <div className="edit-form">
              <input 
                type="text" 
                value={updateValue} 
                onChange={(e) => setUpdateValue(e.target.value)} 
                placeholder="Enter new email address"
              />
              <select 
                value={selectedEmailType} 
                onChange={(e) => setSelectedEmailType(e.target.value)}
              >
                {emailTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <button onClick={handleCreateEmail}>Create Email</button>
              <button onClick={() => { setEditMode(null); setUpdateValue(''); }}>Cancel</button>
            </div>
          )}
          {editMode === 'createAddress' && (
            <div className="edit-form">
              <input 
                type="text" 
                value={updateValue} 
                onChange={(e) => setUpdateValue(e.target.value)} 
                placeholder="Enter new address info"
              />
              <select 
                value={selectedAddressType} 
                onChange={(e) => setSelectedAddressType(e.target.value)}
              >
                {addressTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
              <button onClick={handleCreateAddress}>Create Address</button>
              <button onClick={() => { setEditMode(null); setUpdateValue(''); }}>Cancel</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default People;
