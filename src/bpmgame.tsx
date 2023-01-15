import { Action, ActionPanel, Detail, Form, getPreferenceValues, Icon, List, openCommandPreferences } from "@raycast/api";

interface Preferences {
    mode: 'e' | 'm' | 'h',
    rounds: 4 | 6 | 8,
}

export default function Command() {
    const preferences = getPreferenceValues<Preferences>();




const markdown = `
## Can you tell a song's BPM from just a 30-second clip?

#### Game Controls

use f & esc to enter / exit fullscreen.
          
type in the search box to make guesses.
        
use enter / return to confirm your guess.

#### Game Settings

Difficulty: ${preferences.mode}

Rounds: ${preferences.rounds}

## Press Enter To Open The Game In Your Browser
`
    
    return <Detail
        markdown={markdown}
        actions={
            <ActionPanel>
                <Action.OpenInBrowser url={`http://nickharrison.me/fun/bpm?mode=${preferences.mode}&rounds=${preferences.rounds}&enter_fullscreen=true&start_game=true`} />
                    <Action
                        title="Preferences"
                        shortcut={{ modifiers: ["shift"], key: "/" }}
                        onAction={openCommandPreferences}
                        icon={Icon.Gear}
                    />
            </ActionPanel>
        }
    />
}