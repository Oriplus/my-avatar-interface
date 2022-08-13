import { useWeb3React } from "@web3-react/core";
import {
  Grid,
  InputGroup,
  InputLeftElement,
  Input,
  InputRightElement,
  Button,
  FormHelperText,
  FormControl,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import AvatarCard from "../../components/avatar-card";
import Loading from "../../components/loading";
import RequestAccess from "../../components/request-access";
import { useMyAvatarsData } from "../../hooks/useMyAvatarData";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Avatars = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search).get("address");
  const [address, setAddress] = useState('');
  console.log(address);
  const [submitted, setSubmitted] = useState(true);
  const [validAddress, setValidAddress] = useState(true);
  const navigate = useNavigate();
  const { active, library } = useWeb3React();
  const { avatars, loading } = useMyAvatarsData({
    owner: submitted && validAddress ? address : null,
  });

  const handleAddressChange = ({ target: { value } }) => {
    setAddress(value);
    setSubmitted(false);
    setValidAddress(false);
  };

  const submit = (event) => {
    event.preventDefault();
    if (address) {
      const isValid = library.utils.isAddress(address);
      setValidAddress(isValid);
      setSubmitted(true);
      if (isValid) navigate(`/avatars?address=${address}`);
    } else {
      navigate("/avatars");
    }
  };



 useEffect(() => {
    setAddress(params);
  }, [params]);

  if (!active) return <RequestAccess />;

  return (
    <>
      <form onSubmit={submit}>
        <FormControl>
          <InputGroup mb={3}>
            <InputLeftElement
              pointerEvents="none"
              children={<SearchIcon color="gray.300" />}
            />
            <Input
              isInvalid={false}
              value={address ?? ""}
              onChange={handleAddressChange}
              placeholder="Buscar por dirección"
            />
            <InputRightElement width="5.5rem">
              <Button type="submit" h="1.75rem" size="sm">
                Buscar
              </Button>
            </InputRightElement>
          </InputGroup>
          {submitted && !validAddress && (
            <FormHelperText>Dirección no válida</FormHelperText>
          )}
        </FormControl>
      </form>
      {loading ? (
        <Loading></Loading>
      ) : (
        <Grid templateColumns="repeat(auto-fill, minmax(250px, 1fr))" gap={6}>
          {avatars.map(({ name, image, tokenId }) => (
            <Link key={tokenId} to={`/avatars/${tokenId}`}>
              <AvatarCard image={image} name={name} />
            </Link>
          ))}
        </Grid>
      )}
    </>
  );
};

export default Avatars;
