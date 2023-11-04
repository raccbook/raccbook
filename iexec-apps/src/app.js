const axios = require("axios");
const extractId = require("./extractId");

const getUserById = (id) => {
  const query = `
    {
      user(id: "${id}") {
        id
        address
        handle
        rating
        numReviews
        updatedAt
        createdAt
        description {
          about
          country
          headline
          id
          title
          timezone
          skills_raw
        }
      }
    }
    `;
  return processRequest(query);
};

const processRequest = async (query) => {
  try {
    return (
      await axios.post(
        "https://api.thegraph.com/subgraphs/name/talentlayer/talentlayer-polygon",
        { query }
      )
    ).data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

(async () => {
  try {
    // GET USER ID FROM PROTECTED DATA
    const iexecIn = process.env.IEXEC_IN;
    // const id = extractId(`${iexecIn}/protectedData.zip`);
    const id = "10"
    // GET USER FROM TALENTLAYER ID
    const userData = await getUserById(id);
    console.log(userData);

    // CALCULATE CREDIT SCORE BASED ON USERDATA
    console.log(userData.data.user.rating)
    console.log(userData.data.user.numReviews)
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})();
