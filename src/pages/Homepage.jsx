import React, { useEffect, useState } from 'react';
import { Table, Spin } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import CharacterDeets from './components/CharacterDeets';

function Homepage() {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCharacter, setSelectedCharacter] = useState(null);
    const [characterMovies, setCharacterMovies] = useState([]);

    const loadFavoritesFromStorage = (data) => {
        const storedFavorites = localStorage.getItem('favorites');
        if (storedFavorites) {
            const favorites = JSON.parse(storedFavorites);
            return data.map(item => ({
                ...item,
                favorite: favorites.includes(item.name)
            }));
        }
        return data;
    };

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch("https://swapi.dev/api/people/");
                const data = await response.json();

                const charactersWithDetails = await Promise.all(data.results.map(async character => {
                    const homeworldResponse = await fetch(character.homeworld);
                    const homeworldData = await homeworldResponse.json();

                    // Fetch image from the extended API
                    const characterImageResponse = await fetch(`https://akabab.github.io/starwars-api/api/id/${character.url.split('/').slice(-2, -1)[0]}.json`);
                    const characterImageData = await characterImageResponse.json();

                    return {
                        ...character,
                        homeworldName: homeworldData.name,
                        favorite: false,
                        image: characterImageData.image // Add image URL
                    };
                }));

                const dataWithFavorites = loadFavoritesFromStorage(charactersWithDetails);
                setTableData(dataWithFavorites);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        }

        getData();
    }, []);

    const handleFavoriteClick = (record) => {
        const updatedData = tableData.map(item => {
            if (item.name === record.name) {
                return { ...item, favorite: !item.favorite };
            }
            return item;
        });

        const favorites = updatedData.filter(item => item.favorite).map(item => item.name);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        setTableData(updatedData);
    };

    const handleRowClick = async (record) => {
        setSelectedCharacter(record);

        try {
            const moviePromises = record.films.map(async filmUrl => {
                const response = await fetch(filmUrl);
                const filmData = await response.json();
                return filmData.title;
            });
            const movies = await Promise.all(moviePromises);
            setCharacterMovies(movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
            setCharacterMovies([]);
        }
    };

    const handleCloseCharacterDeets = () => {
        setSelectedCharacter(null);
        setCharacterMovies([]);
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
        {
            title: 'Height',
            dataIndex: 'height',
            key: 'height',
            responsive: ['sm', 'md', 'lg', 'xl'],
        },
        {
            title: 'Homeworld',
            dataIndex: 'homeworldName',
            key: 'homeworldName',
            responsive: ['md', 'lg', 'xl'],
        },
        {
            title: 'Birth Year',
            dataIndex: 'birth_year',
            key: 'birth_year',
            responsive: ['lg', 'xl'],
        },
        {
            title: 'Favorite',
            key: 'favorite',
            render: (_, record) => (
                <span onClick={() => handleFavoriteClick(record)}>
                    {record.favorite ? <StarFilled style={{ color: '#ffc107' }} /> : <StarOutlined />}
                </span>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
    ];

    return (
        <div className='container w-full mx-auto md:py-6 flex flex-col md:flex-row'>
            <div className='flex-grow'>
                <div className='flex md:text-4xl justify-center text-2xl text-center mb-4'>
                    Know your favorite Star Wars characters
                </div>
                {loading ? (
                    <div className='flex justify-center'>
                        <Spin size="large" />
                    </div>
                ) : (
                    <div className='mt-20'>
                        <Table 
                            dataSource={tableData}
                            columns={columns}
                            rowKey="name"
                            pagination={{ pageSize: 5 }}
                            scroll={{ x: 'max-content' }}
                            onRow={(record) => ({
                                onClick: () => handleRowClick(record)
                            })}
                        />
                    </div>
                )}
            </div>
            {selectedCharacter && (
                <div className='w-full md:w-1/3 p-4 border-t md:border-t-0 md:border-l'>
                    <CharacterDeets 
                        character={selectedCharacter}
                        movies={characterMovies}
                        onClose={handleCloseCharacterDeets}
                    />
                </div>
            )}
        </div>
    );
}

export default Homepage;
