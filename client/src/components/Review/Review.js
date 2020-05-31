import React from 'react';

export default function Navbar() {
    const [input1, setInput1] = useState("");
    const [input2, setInput2] = useState("");

    function submitReview() {
        console.log("Hello")
    }

    return (
        <div>
            <form>
                <input
                    type="text"
                    name="input1"
                    placeholder="input1"
                    onChange={e => setInput1(e.target.value)}
                />
                <input
                    type="text"
                    name="input2"
                    placeholder="input2"
                    onChange={e => setInput2(e.target.value)}
                />
                <button type="button" onClick={submitReview}>Login</button>
            </form>
        </div>
    )
}