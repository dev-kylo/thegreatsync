import { useMemo, useRef, useState } from 'react';

function useHoneypot(): { honeypot: JSX.Element; checkForHoney: () => boolean } {
    const [val, setVal] = useState('');
    const honeyEl = useRef<HTMLInputElement>(null);

    const input = useMemo(
        () => (
            <input
                value={val}
                id="emailh"
                name="emailh"
                className="absolute invisible w-0 h-0"
                ref={honeyEl}
                onChange={(e) => setVal(e.target.value)}
            />
        ),
        [val]
    );

    const checkForHoney = () => {
        const honeyElement = honeyEl.current && honeyEl.current.value;
        return !!(honeyElement || val);
    };

    return {
        honeypot: input,
        checkForHoney,
    };
}

export default useHoneypot;
