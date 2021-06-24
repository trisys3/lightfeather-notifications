const {document} = globalThis;

const element = document?.getElementById('notifications');

import './app.css';

import {Fragment, useState} from 'react';
import {render} from 'react-dom';
import {post} from 'axios';

render(<Notifications />, element);

export default function Notifications() {
  const [submitted, setSubmitted] = useState();
  const [error, setError] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [type, setType] = useState('email');
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();
  const [supervisor, setSupervisor] = useState();

  let typeJsx = <label className='label email'>
    <div className='label-text email-label'>{'Email'}</div>
    <input type='text' className='field' placeholder='Email' id='email' value={email || ''} onChange={event => changeField(event, 'email')} />
  </label>;
  if(type === 'phone') {
    typeJsx = <label className='label phone'>
      <div className='label-text phone-label'>{'Phone'}</div>
      <input type='text' className='field' placeholder='Phone' id='phone' value={phone || ''} onChange={event => changeField(event, 'phone')} />
    </label>;
  }

  return <Fragment>
    <div className='notifications-title'>{'Receive Notifications'}</div>

    <form className='notifications'>
      <label className='label first-name'>
        <div className='label-text first-name-label'>{'First Name'}</div>
        <input type='text' className='field' id='first-name' placeholder='First Name' value={firstName ?? ''} onChange={event => changeField(event, 'first-name')} />
      </label>

      <label className='label last-name'>
        <div className='label-text last-name-label'>{'Last Name'}</div>
        <input type='text' className='field' placeholder='Last Name' id='last-name' value={lastName ?? ''} onChange={event => changeField(event, 'last-name')} />
      </label>

      <div className='types'>
        <div className='types-label'>{'I would like to be notified by:'}</div>

        <label className='type email'>
          <div className='type-label email-label'>{'Email'}</div>
          <input type='radio' name='type' className='type-field' id='email' checked={type === 'email'} onChange={() => setType('email')} />
        </label>

        <label className='type phone'>
          <div className='type-label phone-label'>{'Phone'}</div>
          <input type='radio' name='type' className='type-field' id='phone' checked={type === 'phone'} onChange={() => setType('phone')} />
        </label>
      </div>

      {typeJsx}

      <button onClick={requestNotifications} className='notifications-submit'>{'Receive'}</button>
    </form>
  </Fragment>;

  function changeField({currentTarget: {value: field}}, fieldName) {
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

    setSubmitted();
    setError();

    try {
      await post('https://6099a4760f5a13001721985c.mockapi.io/api/submit');
    } catch(error) {
      setError(true);
    }

    setSubmitted(true);
  }
}
