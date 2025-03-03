// src/constants/avatarConfig.js

const BASE_URL = process.env.NEXT_PUBLIC_VERCEL_URL 
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : '';

const bodyTypeURLs = {
    Boy: {
      Average: `${BASE_URL}/3d/avatars/guyz/Average.glb`,
     // Broad: `${BASE_URL}/3d/avatars/guyz/Heavy.glb`,
      Muscular: `${BASE_URL}/3d/avatars/guyz/Muscular.glb`,
      PlusSize: `${BASE_URL}/3d/avatars/guyz/PlusSize.glb`,
      Petite: `${BASE_URL}/3d/avatars/guyz/Thin.glb`,
     },
    Girl: {
      Average: `${BASE_URL}/3d/avatars/gurlz/Average.glb`,
      Muscular: `${BASE_URL}/3d/avatars/gurlz/Muscular.glb`,
      PlusSize: `${BASE_URL}/3d/avatars/gurlz/PlusSize.glb`,
      Petite: `${BASE_URL}/3d/avatars/gurlz/Thin.glb`,
    },
  };
  
  const hairURLs = {
    Barbers: `${BASE_URL}/3d/hair/man/ManHair1.glb`,
    PogiCut: `${BASE_URL}/3d/hair/man/ManHair2.glb`,
    DoublePonytail: `${BASE_URL}/3d/hair/woman/GirlHair1.glb`,
    Short: `${BASE_URL}/3d/hair/woman/GirlHair2.glb`,
    Kulot: `${BASE_URL}/3d/hair/woman/GirlHair3.glb`,
  };

  const tshirURLs = {
    Boy:{
      //Average: `${BASE_URL}/3d/wears/guyz/tshirts/Average_Tshirt.glb`,
      Average: `${BASE_URL}/3d/uvmap/average.glb`,
      //Average: `${BASE_URL}/3d/uvmap/untitled.glb`,

      Muscular: `${BASE_URL}/3d/wears/guyz/tshirts/Muscular_Tshirt.glb`,
      Petite: `${BASE_URL}/3d/wears/guyz/tshirts/Petite_Tshirt.glb`,
      PlusSize: `${BASE_URL}/3d/wears/guyz/tshirts/PlusSize_Tshirt.glb`,
    },
    Girl:{
      Average: `${BASE_URL}/3d/wears/gurlz/tshirts/Average_Tshirt.glb`,
      Muscular: `${BASE_URL}/3d/wears/gurlz/tshirts/Muscular_Tshirt.glb`,
      Petite: `${BASE_URL}/3d/wears/gurlz/tshirts/Petite_Tshirt.glb`,
      PlusSize: `${BASE_URL}/3d/wears/gurlz/tshirts/PlusSize_Tshirt.glb`,
    }
  }

  const shortsURLs = {
    Boy:{
      Average: `${BASE_URL}/3d/wears/guyz/shorts/Average_Short.glb`,
      Muscular: `${BASE_URL}/3d/wears/guyz/shorts/Muscular_Short.glb`,
      Petite: `${BASE_URL}/3d/wears/guyz/shorts/Petite_Short.glb`,
      PlusSize: `${BASE_URL}/3d/wears/guyz/shorts/PlusSize_Short.glb`,
    },
    Girl:{
      Average: `${BASE_URL}/3d/wears/gurlz/shorts/Average_Short.glb`,
      Muscular: `${BASE_URL}/3d/wears/gurlz/shorts/Muscular_Short.glb`,
      Petite: `${BASE_URL}/3d/wears/gurlz/shorts/Petite_Short.glb`,
      PlusSize: `${BASE_URL}/3d/wears/gurlz/shorts/PlusSize_Short.glb`,
    }
  }
  
const tshirtTextureURLs = {
  Boy: {
    Average: `${BASE_URL}/3d/uvmap/TexturedMESH.png`,
  },
  Girl: {
    Average: `${BASE_URL}/3d/wears/guyz/tshirts/Average_Tshirt_Texture.glb`,
  }

}

  export { bodyTypeURLs, hairURLs, tshirURLs, shortsURLs, tshirtTextureURLs};
