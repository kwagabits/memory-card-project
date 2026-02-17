import { useState, useEffect } from "react";
import './GameBoard.css'

function GameBoard({onScoreUpdate}) {
    const [dogs, setDogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [clickedIds, setClickedIds] = useState([]);

    const fallbackFacts = [
        "A dog's nose print is unique, much like a human's fingerprint.",
        "Dogs have about 1,700 taste buds, while humans have about 9,000.",
        "The Labrador Retriever has been the most popular dog breed for 30 years.",
        "A dog's sense of smell is 10,000 to 100,000 times better than humans.",
        "Dogs can understand up to 250 words and gestures.",
        "The Basenji dog doesn't bark, but it can yodel.",
        "Greyhounds can run up to 45 miles per hour.",
        "Dog's dream like humans and twitch when sleeping.",
        "Puppies are born blind and deaf, relying on touch and smell.",
        "A dog's whiskers help them detect tiny changes in air currents.",
        "Dogs have three eyelids: one to protect the eye and keep it moist.",
        "The oldest dog lived to be 29 years old.",
        "Dogs curl up to sleep to protect their vital organs.",
        "A dog's wet nose helps absorb scent chemicals.",
        "Dogs can see in color, just not as vividly as humans."
    ]

    useEffect(() => {
        const fetchDogs = async () => {
            try {
                setLoading(true);

                const imageResponse = await fetch('https://dog.ceo/api/breeds/image/random/12');
                const imageData = await imageResponse.json();

                const dogsWithFacts = await Promise.all(
                    imageData.message.map(async (imageUrl) => {
                        try {
                            const factResponse = await fetch('https://dog-api.kinduff.com/api/facts?number=1');
                            const factData = await factResponse.json(); 
                            
                            let fact;
                            if(factData.success && factData.facts && factData.facts.length > 0) {
                                fact = factData.facts[0];
                            } else {
                                fact = fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)];                            
                            }     

                            return {
                                id: crypto.randomUUID(),
                                image: imageUrl,
                                fact: fact,
                                clicked: false
                            };                        
                        } catch (error) {

                            return {
                                id: crypto.randomUUID(),
                                image: imageUrl,
                                fact: fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)],
                                clicked: false
                            }
                        }

                    })
                );

                setDogs(dogsWithFacts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching dogs:', error);
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