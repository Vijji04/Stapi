import Homepage from "./pages/Homepage";
import { ChakraProvider } from '@chakra-ui/react';
function App() {
  return (
    <ChakraProvider>
    <Homepage />

    </ChakraProvider>
  );
}

export default App;
