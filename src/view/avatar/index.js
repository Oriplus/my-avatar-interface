import {
  Stack,
  Heading,
  Text,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Button,
  Tag,
  useToast,
} from "@chakra-ui/react";
import { useWeb3React } from "@web3-react/core";
import RequestAccess from "../../components/request-access";
import AvatarCard from "../../components/avatar-card";
import { useParams } from "react-router-dom";
import Loading from "../../components/loading";
import { useSingularAvatarData } from "../../hooks/useMyAvatarData";
import { useState } from "react";
import useMyAvatar from "../../hooks/useMyAvatar";

const Avatar = () => {
  const { active, account, library } = useWeb3React();
  const { tokenId } = useParams();
  const { singleAvatar, loading, update } = useSingularAvatarData(tokenId);
  const toast = useToast();
  const [transfering, setTransfering] = useState(false);
  const myAvatar = useMyAvatar();

  const transfer = () => {
  setTransfering(true);

  const address = prompt("Ingresa la dirección: ");

  const isAddress = library.utils.isAddress(address);

  if (!isAddress) {
    toast({
      title: "Dirección inválida",
      description: "La dirección no es una dirección de Ethereum",
      status: "error",
    });
    setTransfering(false);
  } else {
    myAvatar.methods
      .safeTransferFrom(singleAvatar.owner, address, singleAvatar.tokenId)
      .send({
        from: account,
      })
      .on("error", () => {
        setTransfering(false);
      })
      .on("transactionHash", (txHash) => {
        toast({
          title: "Transacción enviada",
          description: txHash,
          status: "info",
        });
      })
      .on("receipt", () => {
        setTransfering(false);
        toast({
          title: "Transacción confirmada",
          description: `El punk ahora pertenece a ${address}`,
          status: "success",
        });
        update();
      });
  }
};

  if (!active) return <RequestAccess />;

  if (loading) return <Loading />;

  return (
    <Stack
      spacing={{ base: 8, md: 10 }}
      py={{ base: 5 }}
      direction={{ base: "column", md: "row" }}
    >
      <Stack>
        <AvatarCard
          mx={{
            base: "auto",
            md: 0,
          }}
          name={singleAvatar.name}
          image={singleAvatar.image}
        />
        <Button onClick={transfer} isLoading={transfering} disabled={account !== singleAvatar.owner} colorScheme="green">
          {account !== singleAvatar.owner ? "No eres el dueño" : "Transferir"}
        </Button>
      </Stack>
      <Stack width="100%" spacing={5}>
        <Heading>{singleAvatar.name}</Heading>
        <Text fontSize="xl">{singleAvatar.description}</Text>
        <Text fontWeight={600}>
          DNA:
          <Tag ml={2} colorScheme="green">
            {singleAvatar.dna}
          </Tag>
        </Text>
        <Text fontWeight={600}>
          Owner:
          <Tag ml={2} colorScheme="green">
            {singleAvatar.owner}
          </Tag>
        </Text>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Atributo</Th>
              <Th>Valor</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(singleAvatar.attributes).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>
                  <Tag>{value}</Tag>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Stack>
    </Stack>
  );
};

export default Avatar;
