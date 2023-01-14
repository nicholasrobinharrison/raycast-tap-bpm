import { Action, ActionPanel, Detail, getPreferenceValues, Icon, openCommandPreferences } from "@raycast/api";
import { useCallback, useEffect, useState } from "react";

interface Preferences {
    resetTimer: number;
    bpmDecimalPlaces: number;
    perBeatDecimalPlaces: number;
}

export default function Command() {
    const preferences = getPreferenceValues<Preferences>();
    const [count, setCount] = useState(0);
    const [taps, setTaps] = useState<number>(0);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [resetTimer, setResetTimer] = useState(0);
    const [bpm, setBPM] = useState((0).toFixed(preferences.bpmDecimalPlaces));
    const [perBeat, setPerBeat] = useState((0).toFixed(preferences.perBeatDecimalPlaces));

    const reset = () => {
        setTimeElapsed(0);
        setCount(0);
        setTaps(0);
    };

    useEffect(() => {
        if (timeElapsed) {
            setBPM(((1000 / (timeElapsed / taps)) * 60).toFixed(preferences.bpmDecimalPlaces || 1));
            setPerBeat((timeElapsed / taps).toFixed(preferences.perBeatDecimalPlaces || 2));
        }
    }, [timeElapsed]);

    useEffect(() => {
        let interval: any;
        
        if (resetTimer >= preferences.resetTimer) {
            reset();
        }

        if (taps && resetTimer < preferences.resetTimer) {
            interval = setInterval(() => {
                setResetTimer((resetTimer) => resetTimer + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [taps, resetTimer]);

    const onTap = useCallback(() => {
        let newTaps = taps + 1;
        const d = new Date();
        const increment = timeElapsed + (d.valueOf() - count);

        if (newTaps === 2) {
            // doubles the first "timeElapsed" value
            // to simulate the missing interval from 0-1
            setTimeElapsed(increment * 2);
        } else {
            count && setTimeElapsed(increment);
        }

        setTaps(newTaps);
        setCount(d.valueOf());
        setResetTimer(0);
    }, [taps]);

    return (
        <Detail
            markdown={`# ${bpm}`}
            metadata={
                <Detail.Metadata>
                    <Detail.Metadata.Label 
                        title="Beats"
                        text={taps.toString()}
                    />
                    <Detail.Metadata.Label
                        title="MS per Beat"
                        text={perBeat}
                    />
                    <Detail.Metadata.Label
                        title={`BPM reset: ${preferences.resetTimer} seconds`} 
                        text="(or hit shift + 'r')"
                    />
                    <Detail.Metadata.Label
                        title={resetTimer >= preferences.resetTimer ? "BPM will reset on next tap" : ""}
                    />
                </Detail.Metadata>
            }
            actions={
                <ActionPanel>
                    <Action
                        title="Tap"
                        onAction={onTap}
                        icon={Icon.Heartbeat}
                    />
                    <Action 
                        title="Reset"
                        shortcut={{ modifiers: ["shift"], key: "r" }}
                        onAction={reset}
                        icon={Icon.ArrowCounterClockwise}
                    />
                    <Action 
                        title="Preferences"
                        shortcut={{ modifiers: ["shift"], key: '/' }}
                        onAction={openCommandPreferences}
                        icon={Icon.Gear}
                    />
                </ActionPanel>
            }
        />
    );
}
