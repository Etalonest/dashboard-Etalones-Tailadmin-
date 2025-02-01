'use client'
import { useState, useEffect } from "react";
import { FunnelCandidate } from "./FunnelCandidate/FunnelCandidate"
import { CallHistory } from "./CallHistory/CallHistory";
import RecruiterStage from "./FunnelCandidate/RecruiterStage/RecruiterStage";

const Funnel = ({ onDataChange, candidate }: any) => {
     const [funnel, setFunnel] = useState({
      
      });
    
      useEffect(() => {
        console.log("useEffect: candidate", candidate); 
        if (candidate?.funnel) {
          console.log("Updating funnel state from candidate:", candidate.funnel); 
          setFunnel({
            presentation: candidate.funnel.presentation ?? false,
            viber: candidate.funnel.viber ?? false,
            whatsapp: candidate.funnel.whatsapp ?? true,
            telegram: candidate.funnel.telegram ?? false,
            positive: candidate.funnel.positive ?? false,
          });
        }
      }, [candidate]); 
    
      
      useEffect(() => {
        console.log("useEffect: funnel updated", funnel); 
        if (onDataChange) {
          onDataChange(funnel); 
        }
      }, [funnel, onDataChange]);
    
    return(
        <>
        <CallHistory candidate={candidate}/>
        <RecruiterStage candidate={candidate}/>
        </>
    )
}
export default Funnel