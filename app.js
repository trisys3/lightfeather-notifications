const {document} = globalThis;

const element = document?.getElementById('notifications');

import './app.css';

import {Fragment, useState} from 'react';
import {render} from 'react-dom';
import {post} from 'axios';

render(<Notifications />, element);

export default function Notifications() {
  const [submitted, setSubmitted] = useState();
  const [changed, setChanged] = useState();
  const [error, setError] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [type, setType] = useState('email');
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [supervisor, setSupervisor] = useState();

  return <Fragment>
    <div className='notifications-title'>{'Receive Notifications'}</div>

    <form className='notifications'>
      <label className='label first-name'>
        <div className='label-text first-name-label'>{'First Name'}</div>
        <input type='text' required className='field' id='first-name' placeholder='First Name' value={firstName ?? ''} onChange={event => changeField(event, 'first-name')} />
      </label>

      <label className='label last-name'>
        <div className='label-text last-name-label'>{'Last Name'}</div>
        <input type='text' required className='field' placeholder='Last Name' id='last-name' value={lastName ?? ''} onChange={event => changeField(event, 'last-name')} />
      </label>

      <div className='types-label'>{'Get notified by:'}</div>

      <label className='label type email'>
        <div className='label-text type-label email-label'>
          <div className='type-label-text'>{'Email'}</div>
          <input type='radio' name='type' className='type-option' id='email' checked={type === 'email'} onChange={() => setType('email')} />
        </div>

        <input type='text' required className='field' placeholder='Email' id='email' value={email || ''} onClick={() => setType('email')} onChange={event => changeField(event, 'email')} />
      </label>

      <label className='label type phone'>
        <div className='label-text type-label phone-label'>
          <div className='type-label-text'>{'Phone'}</div>
          <input type='radio' name='type' className='type-option' id='phone' checked={type === 'phone'} onChange={() => setType('phone')} />
        </div>

        <input type='text' required className='field' placeholder='Phone' id='phone' value={phone || ''} onClick={() => setType('phone')} onChange={event => changeField(event, 'phone')} />
      </label>

      <button onClick={requestNotifications} disabled={submitted} className='notifications-submit'>{'Receive'}</button>
    </form>
  </Fragment>;

  function changeField({currentTarget: {value: field}}, fieldName) {
    setSubmitted();

    switch(fieldName) {
      case 'first-name': {
        setFirstName(field);
        break;
      } case 'last-name': {
        setLastName(field);
        break;
      } case 'email': {
        setEmail(field);
        break;
      } case 'phone': {
        setPhone(field);
        break;
      } case 'supervisor': {
        setSupervisor(field);
      }
    }
  }

  async function requestNotifications(event) {
    event.preventDefault();

    setError();

    let typeVal = email;
    if(type === 'phone') {
      typeVal = phone;
    }

    const data = {
      firstName,
      lastName,
      [type]: typeVal,
      supervisor,
    };

    try {
      // await post('https://6099a4760f5a13001721985c.mockapi.io/api/submit', data);
    } catch(error) {
      setError(true);
    }

    setSubmitted(true);
  }
}
