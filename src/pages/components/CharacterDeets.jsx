// CharacterDeets.js
import React from 'react';
import { Box, Heading, Text, CloseButton, UnorderedList, ListItem } from '@chakra-ui/react';

function CharacterDeets({ character, onClose, movies }) {
    if (!character) {
        return null; // Return nothing if no character is selected
    }

    return (
        <Box 
            className='character-deets'
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={5}
            boxShadow="lg"
            bg="white"
            position="relative"
        >
            <CloseButton 
                position="absolute"
                top="10px"
                right="10px"
                onClick={onClose}
            />

            <Heading as="h2" size="lg" mb={4}>
                Character Details
            </Heading>
            <Text fontSize="md" mb={2}>
                <strong>Name:</strong> {character.name}
            </Text>
            <Text fontSize="md" mb={2}>
                <strong>Height:</strong> {character.height} cm
            </Text>
            <Text fontSize="md" mb={2}>
                <strong>Homeworld:</strong> {character.homeworldName}
            </Text>
            <Text fontSize="md" mb={2}>
                <strong>Birth Year:</strong> {character.birth_year}
            </Text>
            <Text fontSize="md" mb={2}>
                <strong>Eye Color:</strong> {character.eye_color}
            </Text>

            {/* Display movie titles */}
            <Heading as="h3" size="md" mt={4} mb={2}>
                Movies
            </Heading>
            <UnorderedList>
                {movies.map((movie, index) => (
                    <ListItem key={index}>{movie}</ListItem>
                ))}
            </UnorderedList>
        </Box>
    );
}

export default CharacterDeets;
