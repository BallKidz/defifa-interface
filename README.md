# Defifa

The web interface for [defifa.net](https://defifa.net).

## Resources

| Resource | Description |
| --- | --- |
| [Subgraph](https://github.com/BallKidz/defifa-subgraph) | The UI relies on an up-to-date deployment of this Subgraph |
| [Discord](https://discord.gg/uPbqmbpQDw) | Come chat |

## Getting Started

1. Create a `.env` file. Ask Kmac or Blaz for the values.
1. Install dependencies:

   ```bash
   npm install
   ```

1. Start the development server:

   ```bash
   npm run dev
   ```
   
   
## Development 

### Integrate a new contract deployment

1. Bump the `@ballkidz/defifa-collection-deployer` version in `package.json`.
2. Run `npm install` to install the latest contract ABIs.
3. Ask Jango if the `IDefifaDelegate_INTERFACE_ID` has changed. If it has, make that change to the `const IDefifaDelegate_INTERFACE_ID`
4. Make code changes. Typically this means updating contract calls (wagmi hooks), types/interfaces and similar.
5. Update Subgraph if required. [Learn more](https://github.com/BallKidz/defifa-subgraph) about the subgraph.
