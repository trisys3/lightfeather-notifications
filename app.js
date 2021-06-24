const phoneRegex = /^\d{10}$/;
const emailRegex = /^[^@]+@[A-Za-z]+\.[A-Za-z]{2,}$/;

const {document} = globalThis;

const element = document?.getElementById('notifications');

import './app.css';

import {Fragment, useState, useEffect} from 'react';
import {render} from 'react-dom';
import axios, {post} from 'axios';

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
  const [supervisors, setSupervisors] = useState();
  const [supervisor, setSupervisor] = useState();

  useEffect(() => {
    getSupervisors();
  }, []);

  const phoneShow = maskPhone(phone);

  let supervisorExtraClasses = 'no-supervisors';
  let supervisorsJsx = <option className='supervisor no-supervisor'>{'Supervisors'}</option>;
  if(supervisors?.length) {
    supervisorExtraClasses = '';
    supervisorsJsx = supervisors?.map(supervisor => <option key={supervisor} className='supervisor' onClick={event => changeField(event, 'supervisor')}>{supervisor}</option>);
  }

  return <Fragment>
    <div className='notifications-title'>{'Receive Notifications'}</div>

    <form className='notifications'>
      <label className='label first-name'>
        <div className='label-text first-name-label'>{'First Name'}</div>
        <input type='text' autoFocus required autoComplete='true' className='field' id='first-name' placeholder='First Name' value={firstName ?? ''} onChange={event => changeField(event, 'first-name')} />
      </label>

      <label className='label last-name'>
        <div className='label-text last-name-label'>{'Last Name'}</div>
        <input type='text' required autoComplete='true' className='field' placeholder='Last Name' id='last-name' value={lastName ?? ''} onChange={event => changeField(event, 'last-name')} />
      </label>

      <div className='types-label'>{'Get notified by:'}</div>

      <label className='label type email'>
        <div className='label-text type-label email-label'>
          <div className='type-label-text'>{'Email'}</div>
          <input type='radio' name='type' autoComplete='true' className='type-option' id='email' checked={type === 'email'} onChange={event => changeType(event, 'email')} />
        </div>

        <input type='text' required autoComplete='true' className='field' placeholder='Email' id='email' value={email || ''} onClick={event => changeType(event, 'email')} onChange={event => changeField(event, 'email')} />
      </label>

      <label className='label type phone'>
        <div className='label-text type-label phone-label'>
          <div className='type-label-text'>{'Phone'}</div>
          <input type='radio' name='type' autoComplete='true' className='type-option' id='phone' checked={type === 'phone'} onChange={event => changeType(event, 'phone')} />
        </div>

        <input type='tel' required autoComplete='true' className='field' placeholder='Phone' id='phone' value={phoneShow} onClick={event => changeType(event, 'phone')} onChange={changePhone} />
      </label>

      <label className='label supervisor'>
        <div className='label-text supervisor-label'>{'Supervisor'}</div>
        <select required autoComplete='true' className={`field ${supervisorExtraClasses}`} id='supervisor'>
          {supervisorsJsx}
        </select>
      </label>

      <button onClick={requestNotifications} disabled={!canSubmit() || submitted && 'disabled' || null} className='notifications-submit'>{'Receive'}</button>
    </form>
  </Fragment>;

  function canSubmit() {
    return firstName && lastName && phone?.match(phoneRegex) && email?.match(emailRegex);
  }

  function maskPhone(phone = '') {
    let phoneShow = `( ${phone.slice(0, 3)}`;
    phoneShow = phoneShow.padEnd(5, '_');
    phoneShow += ' ) - ';

    phoneShow += phone.slice(3, 6) ?? '';
    phoneShow = phoneShow.padEnd(13, '_');
    phoneShow += ' - ';

    phoneShow += phone.slice(6, 10);
    phoneShow = phoneShow.padEnd(20, '_');

    return phoneShow;
  }

  function unmaskPhone(phoneShow) {
    const phoneMatches = phoneShow?.match(/\d+/g) ?? '';
    const phone = phoneMatches?.join('') ?? '';

    return phone?.slice(0, 10);
  }

  function changeType(event, type) {
    setSubmitted();
    setType(type);
  }

  function changePhone({currentTarget: {value: phoneShow}, nativeEvent}) {
    const phone = unmaskPhone(phoneShow);

    setSubmitted();
    setPhone(phone);
  }

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
      await post('https://6099a4760f5a13001721985c.mockapi.io/api/submit', data);
    } catch(error) {
      setError(true);
    }

    setSubmitted(true);
  }

  async function getSupervisors() {
    let supervisors;
    try {
      ({data: supervisors} = await axios('https://6099a4760f5a13001721985c.mockapi.io/api/supervisors'));
    } catch(error) {
      return;
    }

    ({results: supervisors = supervisors} = supervisors ?? {});

    supervisors = supervisors?.map?.(data => {
      const {name: nameData} = data ?? {};
      const {title, first, last} = nameData ?? {};

      let titleShow = title;
      if(title === 'Mr' || title === 'Mrs' || title === 'Ms') {
        titleShow += '.';
      }

      const nameParts = [titleShow, first, last];

      return nameParts.filter(namePart => namePart)
        .join(' ');
    });

    setSupervisors(supervisors);
    setSupervisor(supervisors?.[0]);
  }
}
