import { useState, useEffect } from "react";
import './GameBoard.css'

function GameBoard({onScoreUpdate}) {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [clickedIds, setClickedIds] = useState([]);

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                setLoading(true);

                const imageResponse = await fetch('https://dog.ceo/api/breeds/image/random/12');
                const imageData = await imageResponse.json();

                const dogsWithFacts = await Promise.all(
                    imageData.message.map(async (imageUrl) => {
                        const factResponse = await fetch('https://dog-api.kinduff.com/api/facts');
                        const factData = await factResponse.json();
                        return {
                            id: crypto.randomUUID(),
                            image: imageUrl,
                            fact: factData.facts[0],
                        };
                    })
                );

                setDogs(dogsWithFacts);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchDogs();
    }, []);

    const shuffleArray = (array) => {
        return [...array].sort(() => Math.random() - 0.5);
    };

    const handleCardClick = (clickedDog) => {
        if(clickedIds.includes(clickedDog.id)) {
            setScore(0);
            setClickedIds([]);
            onScoreUpdate(0);

            setDogs(shuffleArray(dogs));
        } else {
            const newScore = score + 1;
            setScore(newScore);
            setClickedIds([...clickedIds, clickedDog.id]);
            onScoreUpdate(newScore);

            setDogs(shuffleArray(dogs));
        }
    };

    const resetGame = () => {
        setScore(0);
        setClickedIds([]);
        onScoreUpdate(0);
        setDogs(shuffleArray(dogs));
    };

    if (loading) {
        return (
            <div className="gameboard">
                <div className="loading">
                    <h2>Loading adorable dogs...</h2>
                    <p>Fetching your furry friends...</p>
                </div>                
            </div>

        );
    }

    return (
        <div className="gameboard">

            <button className="reset-btn" onClick={resetGame}>New Game</button>


            <div className="card-grid">
                {dogs.map((dog) => (
                    <div
                        key={dog.id}
                        className="card"
                        onClick={() => handleCardClick(dog)}
                    >
                        <img src={dog.image} alt="Cute dog" className="card-image" loading="lazy"/>
                        <div className="fact-bubble">
                            <p>{dog.fact}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameBoard;