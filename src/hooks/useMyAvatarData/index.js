import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useMyAvatar from "../useMyAvatar";

const getAvatarData = async ({ myAvatar, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    myAvatar.methods.tokenURI(tokenId).call(),
    myAvatar.methods.tokenDNA(tokenId).call(),
    myAvatar.methods.ownerOf(tokenId).call(),
    myAvatar.methods.getAccessoriesType(tokenId).call(),
    myAvatar.methods.getClotheColor(tokenId).call(),
    myAvatar.methods.getClotheType(tokenId).call(),
    myAvatar.methods.getEyeType(tokenId).call(),
    myAvatar.methods.getEyeBrowType(tokenId).call(),
    myAvatar.methods.getFacialHairColor(tokenId).call(),
    myAvatar.methods.getFacialHairType(tokenId).call(),
    myAvatar.methods.getHairColor(tokenId).call(),
    myAvatar.methods.getHatColor(tokenId).call(),
    myAvatar.methods.getGraphicType(tokenId).call(),
    myAvatar.methods.getMouthType(tokenId).call(),
    myAvatar.methods.getSkinColor(tokenId).call(),
    myAvatar.methods.getTopType(tokenId).call(),
  ]);
  const responseMetada = await fetch(tokenURI);
  const metadata = await responseMetada.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

//plural
const useMyAvatarsData = ({ owner = null } = {}) => {
  const [avatars, setAvatars] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const myAvatar = useMyAvatar();

  const update = useCallback(async () => {
    if (myAvatar) {
      setLoading(true);
      let tokenIds;
      if (!library.utils.isAddress(owner)) {
        const totalSupply = await myAvatar.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await myAvatar.methods.balanceOf(owner).call();
        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            myAvatar.methods.tokenOfOwnerByIndex(owner, index).call()
          );
        tokenIds = await Promise.all(tokenIdsOfOwner);
      }
      const avatarPromise = tokenIds.map((tokenId) =>
        getAvatarData({ myAvatar, tokenId })
      );
      const avatars = await Promise.all(avatarPromise);
      setAvatars(avatars);
      setLoading(false);
    }
  }, [myAvatar, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    avatars,
  };
};

const useSingularAvatarData = (tokenId = null) => {
  const [singleAvatar, setSingleAvatar] = useState({});
  const [loading, setLoading] = useState(true);
  const myAvatar = useMyAvatar();

  const update = useCallback(async () => {
    if (myAvatar && tokenId != null) {
      setLoading(true);

      const toSet = await getAvatarData({ tokenId, myAvatar });
      setSingleAvatar(toSet);

      setLoading(false);
    }
  }, [myAvatar, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    singleAvatar,
    update,
  };
};

export { useMyAvatarsData, useSingularAvatarData };
