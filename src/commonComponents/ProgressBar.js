import { React } from "react";
import { useSelector } from 'react-redux';
import {
    FLOW_BILLING, FLOW_NEW, FLOW_PROCESED,
    FLOW_PROCESS, FLOW_SAVED, OPTION_ALBUM
} from "./Properties";

export default function ProgressBar() {
    //redux store
    const flow = useSelector(state => state.alb.flow);
    const isNewFlow = flow === FLOW_NEW;
    const isBillingFlow = flow === FLOW_BILLING;
    const isProcessFlow = flow === FLOW_PROCESS;
    const isProcessedFlow = flow === FLOW_PROCESED || flow === FLOW_SAVED;
    const isAlbumSelected = flow === OPTION_ALBUM;
    const getProgressBarWidth = () => {
        if (isNewFlow) {
            return '0%';
        } else if (isBillingFlow) {
            return '50%';
        } else {
            return '100%';
        }
    };
    
    const getButtonClass = () => {
        if (isBillingFlow || isProcessFlow || isProcessedFlow) {
            return 'btn-success';
        } else if (isAlbumSelected) {
            return 'btn-primary';
        } else {
            return 'btn-secondary';
        }
    };
    
    const progressBarWidth = getProgressBarWidth();
    const buttonClass = getButtonClass();
    
    return (
        <div className="position-relative m-4">
            <div className="progress" style={{ height: '1px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: progressBarWidth }} aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
            <button type="button" className={`position-absolute top-0 start-0 translate-middle btn btn-sm rounded-pill ${buttonClass}`} style={{ width: '2rem', height: '2rem' }}>1</button>
        </div>
    );
    
}