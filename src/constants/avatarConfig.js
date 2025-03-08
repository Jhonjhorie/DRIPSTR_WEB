// src/constants/avatarConfig.js

const getBasePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return 'https://dripstr-web.vercel.app';
  }
  return '';
};

// Add error handling for model loading
const createModelURL = (path) => {
  const url = `${getBasePath()}${path}`;
  return {
    url,
    load: async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      } catch (error) {
        console.error(`Failed to load model: ${url}`, error);
        return null;
      }
    }
  };
};

export const bodyTypeURLs = {
  Boy: {
    Average: createModelURL('/3d/avatars/guyz/Average.glb'),
    Muscular: createModelURL('/3d/avatars/guyz/Muscular.glb'),
    PlusSize: createModelURL('/3d/avatars/guyz/PlusSize.glb'),
    Petite: createModelURL('/3d/avatars/guyz/Thin.glb'),
  },
  Girl: {
    Average: createModelURL('/3d/avatars/gurlz/Average.glb'),
    Muscular: createModelURL('/3d/avatars/gurlz/Muscular.glb'),
    PlusSize: createModelURL('/3d/avatars/gurlz/PlusSize.glb'),
    Petite: createModelURL('/3d/avatars/gurlz/Thin.glb'),
  }
};

const hairURLs = {
    Barbers: `/3d/hair/man/ManHair1.glb`,
    PogiCut: `/3d/hair/man/ManHair2.glb`,
    DoublePonytail: `/3d/hair/woman/GirlHair1.glb`,
    Short: `/3d/hair/woman/GirlHair2.glb`,
    Kulot: `/3d/hair/woman/GirlHair3.glb`,
};

const tshirURLs = {
    Boy: {
      Average: `/3d/uvmap/average.glb`,
      Muscular: `/3d/wears/guyz/tshirts/Muscular_Tshirt.glb`,
      Petite: `/3d/wears/guyz/tshirts/Petite_Tshirt.glb`,
      PlusSize: `/3d/wears/guyz/tshirts/PlusSize_Tshirt.glb`,
    },
    Girl: {
      Average: `/3d/wears/gurlz/tshirts/Average_Tshirt.glb`,
      Muscular: `/3d/wears/gurlz/tshirts/Muscular_Tshirt.glb`,
      Petite: `/3d/wears/gurlz/tshirts/Petite_Tshirt.glb`,
      PlusSize: `/3d/wears/gurlz/tshirts/PlusSize_Tshirt.glb`,
    }
};

const shortsURLs = {
    Boy: {
      Average: `/3d/wears/guyz/shorts/Average_Short.glb`,
      Muscular: `/3d/wears/guyz/shorts/Muscular_Short.glb`,
      Petite: `/3d/wears/guyz/shorts/Petite_Short.glb`,
      PlusSize: `/3d/wears/guyz/shorts/PlusSize_Short.glb`,
    },
    Girl: {
      Average: `/3d/wears/gurlz/shorts/Average_Short.glb`,
      Muscular: `/3d/wears/gurlz/shorts/Muscular_Short.glb`,
      Petite: `/3d/wears/gurlz/shorts/Petite_Short.glb`,
      PlusSize: `/3d/wears/gurlz/shorts/PlusSize_Short.glb`,
    }
};
  
const tshirtTextureURLs = {
  Boy: {
    Average: `${getBasePath()}/3d/uvmap/TexturedMESH.png`,
  },
  Girl: {
    Average: `${getBasePath()}/3d/wears/guyz/tshirts/Average_Tshirt_Texture.glb`,
  }
}

export { hairURLs, tshirURLs, shortsURLs, tshirtTextureURLs };
