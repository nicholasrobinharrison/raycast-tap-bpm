import { Action, ActionPanel, Detail } from "@raycast/api";
import { useEffect, useState } from "react";

export default function Command() {
    const [count, setCount] = useState(0)
    const [taps, setTaps] = useState<number>(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [bpm, setBPM] = useState('0.0');
    const [perBeat, setPerBeat] = useState('0.00');
    const [resetTimer, setResetTimer] = useState(0);

    const reset = () => {
        setTimeElapsed(0)
        setCount(0)
        setTaps(0)
    }

    useEffect(() => {
        if (taps) {
            const d = new Date();
            const increment = timeElapsed + (d.valueOf() - count)
            if (taps === 2) {
                // doubles the first time elapsed value 
                // to simulate the interval from 0-1
                setTimeElapsed(increment * 2);
            } else {
                count && setTimeElapsed(increment);
            }
            setCount(d.valueOf());
        }
        setResetTimer(0);
    }, [taps])

    useEffect(() => {
        if (timeElapsed) {
            setBPM((((1000 / (timeElapsed / (taps))) * 60) || 0).toFixed(1))
            setPerBeat((timeElapsed / taps).toFixed(2))
        }
    }, [timeElapsed])

    useEffect(() => {
        let interval:any;

        if (taps && resetTimer < 2) {
            interval = setInterval(() => {
                setResetTimer(resetTimer => resetTimer + 1)
            }, 1000)
        }

        return () => clearInterval(interval);
    }, [taps, resetTimer])

    useEffect(() => {
        if (resetTimer > 1) {
            reset();
            setTaps(1);
        }
    }, [taps])


    
    return <Detail 
        markdown={`# ${bpm}`} 
        metadata={
            <Detail.Metadata>
                <Detail.Metadata.Label title="Beats" text={taps.toString()} />
                <Detail.Metadata.Label title="MS per Beat" text={perBeat} />
                <Detail.Metadata.Label title="BPM reset: 2 seconds" text="(or hit shift + 'r')"  />
                <Detail.Metadata.Label title={resetTimer > 1 ? 'BPM will reset next tap' : '' }  />
            </Detail.Metadata>
        }
        actions={
            <ActionPanel>
                <Action
                    title='Tap'
                    onAction={()=> {
                        setTaps(taps + 1);
                    }}
                />
                <Action
                    title='Reset'
                    shortcut={{ modifiers: ['shift'], key: 'r' }}
                    onAction={reset}
                />
            </ActionPanel>
        }
    />
}