import { useMemo } from "react";
import { useWeb3React } from "@web3-react/core";
import MyAvatarArtifact from "../../config/web3/artifacts/MyAvatarArtifact";

const { address, abi } = MyAvatarArtifact;

const useMyAvatar = () => {
  const { active, library, chainId } = useWeb3React();
  const myAvatar = useMemo(() => {
    if (active) return new library.eth.Contract(abi, address[chainId]);
  }, [active, chainId, library?.eth?.Contract]);

  return myAvatar
};

export default useMyAvatar;
