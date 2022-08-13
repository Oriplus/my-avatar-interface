import {
  Stack,
  Flex,
  Heading,
  Text,
  Button,
  Image,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";
import useMyAvatar from "../../hooks/useMyAvatar";
import { useCallback, useEffect, useState } from "react";

const Home = () => {
  const [isMinting, setIsMinting] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { active, account } = useWeb3React();
  const myAvatar = useMyAvatar();
  const toast = useToast();

  const getMyAvatarData = useCallback(async () => {
    if (myAvatar) {
      const totalSupply = await myAvatar.methods.totalSupply().call();
      const dnaPreview = await myAvatar.methods
        .deterministicPseudoRandomDNA(totalSupply, account)
        .call();
      const image = await myAvatar.methods.imageByDNA(dnaPreview).call();
      setImageSrc(image);
    }
  }, [myAvatar, account]);

  useEffect(() => {
    getMyAvatarData();
  }, [getMyAvatarData]);

  const mint = () => {
    setIsMinting(true);
    myAvatar.methods.mint().send({
      from: account,
    })
    .on('transactionHash', (txHash) => {
      setIsMinting(false);
      toast({
        title:'',
        description:txHash,
        status:'info'
      })
    })
    .on('receipt', () => {
      setIsMinting(false);
      toast({
        title:'Transacción confirmada',
        description: 'Nunca pares de mintear',
        status:'success'
      })
    })
    .on('error', (error) => {
      setIsMinting(false);
      toast({
        title:'Transacción fallida',
        description: error.message,
        status:'error'
      })
    })
  };

  return (
    <Stack
      align={"center"}
      spacing={{ base: 8, md: 10 }}
      py={{ base: 20, md: 28 }}
      direction={{ base: "column-reverse", md: "row" }}
    >
      <Stack flex={1} spacing={{ base: 5, md: 10 }}>
        <Heading
          lineHeight={1.1}
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", lg: "6xl" }}
        >
          <Text
            as={"span"}
            position={"relative"}
            _after={{
              content: "''",
              width: "full",
              height: "30%",
              position: "absolute",
              bottom: 1,
              left: 0,
              bg: "green.400",
              zIndex: -1,
            }}
          >
            Un My Avatar
          </Text>
          <br />
          <Text as={"span"} color={"green.400"}>
            con muchos estilos
          </Text>
        </Heading>
        <Text color={"gray.500"}>
          My Avatar es una colección de Avatares randomizados cuya metadata
          es almacenada on-chain. Poseen características únicas y sólo hay 10000
          en existencia.
        </Text>
        <Text color={"green.500"}>
          Cada My Avatar se genera de forma secuencial basado en tu address,
          usa el previsualizador para averiguar cuál sería tu My Avatar si
          minteas en este momento
        </Text>
        <Stack
          spacing={{ base: 4, sm: 6 }}
          direction={{ base: "column", sm: "row" }}
        >
          <Button
            rounded={"full"}
            size={"lg"}
            fontWeight={"normal"}
            px={6}
            colorScheme={"green"}
            bg={"green.400"}
            _hover={{ bg: "green.500" }}
            disabled={!myAvatar}
            onClick={mint}
            isLoading={isMinting}
          >
            Obtén tu Avatar
          </Button>
          <Link to="/Avatars">
            <Button rounded={"full"} size={"lg"} fontWeight={"normal"} px={6}>
              Galería
            </Button>
          </Link>
        </Stack>
      </Stack>
      <Flex
        flex={1}
        direction="column"
        justify={"center"}
        align={"center"}
        position={"relative"}
        w={"full"}
      >
        <Image src={active ? imageSrc : "https://avataaars.io/"} />
        {active ? (
          <>
            <Flex mt={2}>
              <Badge>
                Next ID:
                <Badge ml={1} colorScheme="green">
                  1
                </Badge>
              </Badge>
              <Badge ml={2}>
                Address:
                <Badge ml={1} colorScheme="green">
                  0x0000...0000
                </Badge>
              </Badge>
            </Flex>
            <Button
              onClick={getMyAvatarData}
              mt={4}
              size="xs"
              colorScheme="green"
            >
              Actualizar
            </Button>
          </>
        ) : (
          <Badge mt={2}>Wallet desconectado</Badge>
        )}
      </Flex>
    </Stack>
  );
};

export default Home;