import React from 'react';
import { render, fireEvent } from '../../testUtils';
import SpeechRecognition from './SpeechRecognition';
import annyang from 'annyang';

jest.mock('annyang', () => ({
  start: jest.fn(),
  abort: jest.fn(),
  addCommands: jest.fn(),
  removeCommands: jest.fn(),
  addCallback: jest.fn(),
  removeCallback: jest.fn(),
}));

describe('SpeechRecognition', () => {
  it('toggles listening state on button click', () => {
    const { getByText } = render(<SpeechRecognition onSpeech={() => {}} />, {
        wrapperProps: { initialEntries: ['/en'] }
    });
    const button = getByText('Start Listening');

    fireEvent.click(button);
    expect(annyang.start).toHaveBeenCalled();
    expect(getByText('Stop Listening')).toBeInTheDocument();

    fireEvent.click(button);
    expect(annyang.abort).toHaveBeenCalled();
    expect(getByText('Start Listening')).toBeInTheDocument();
  });
});
