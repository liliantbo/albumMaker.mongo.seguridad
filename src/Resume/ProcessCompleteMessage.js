import React from 'react';
import { useFlow } from '../reducers/FlowAndSelectedOptionContext';
import { FLOW_SAVED, MESSAGE_PROCESSED, MESSAGE_SAVED } from '../commonComponents/Properties';


export default function ProcessSuccess () {
  const {state}=useFlow();
  const {flow}=state;
  const isProcessedAndSaved=flow===FLOW_SAVED;
  return (
    <div className="alert alert-success d-flex flex-column justify-content-center m-2" role="alert">
      <p>¡Gracias por tu compra!</p>
      <p className='fs-6, fst-italic'>{isProcessedAndSaved?MESSAGE_SAVED:MESSAGE_PROCESSED}</p>
    </div>
  );
}
