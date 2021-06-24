const {document} = globalThis;

const element = document?.getElementById('notifications');

import './app.css';

import {useState} from 'react';
import {render} from 'react-dom';
import {post} from 'axios';

render(<Notifications />, element);

export default function Notifications() {
  const [submitted, setSubmitted] = useState();
  const [error, setError] = useState();

  return <form onSubmit={requestNotifications}>
  </form>;

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
