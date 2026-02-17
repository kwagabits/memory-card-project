import './Header.css'

function Header({score, bestScore}) {
    return (
        <>
            <header>
                <h1>Dog Memory Game</h1>
                <div className="scores">
                    <p>Current Score: <strong>{score}</strong></p>
                    <p>Best Score: <strong>{bestScore}</strong></p>
                </div>
            </header>         
        </>
    
    )
}       


export default Header;