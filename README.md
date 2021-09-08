# NLUDB React Hooks

This library provides a set of React Hooks that makes it insanely easy to incorporate
NLP into your React application.

These hooks are optimized for in-app usage. For the full set of NLUDB client operations, see the `@nludb/client` Javascript library.

## useNLUDB

The `useNLUDB` hook provides a React-friendly way to instantiate an NLUDB client.

```
  import {useNLUDB} from '@nludb/react-hooks';

  const [nludb, nludbError] = useNLUDB({
    apiKey:apiKey
  })
```

The `nludb` variable represents a client instance from the `@nludb/client` library.

## useEmbeddingIndex

The `useEmbeddingIndex` hook provides a React-friendly way connect to an Embedding Index for semantic search.

```
  import { useEmbeddingIndex } from '@nludb/react-hooks';
  import { EmbeddingModel } from '@nludb/client'

  const [{results, isSearching, error}, {reset, search, insert}] = useEmbeddingIndex({
    nludb: nludb,                // The client from above
    name: "Index Name",
    model: EmbeddingModel.QA,    // The embedding model to use
    upsert: true,                // Load a pre-existing index
  })
```

Search the with:

```
  search({query: "My query"})
```

Reset your search with:

```
  reset()
```

Use the search results provided in the `isSearching` and `results` variables.

## useParser

The `useParser` hook provides a React-friendly way connect to an Parser for text segmentation, parsing, and named entity recognition.

```
  import { useParser } from '@nludb/react-hooks';
  import { ParsingModel } from '@nludb/client'

  const [{results, isParsing, error}, {reset, parse}] = useParser({
    nludb: nludb,                     // The client from above
    model: ParsingModel.EN_DEFAULT,   // Default english model
    includeTokens: false,             // Don't return token-level data
    includeEntities: true             // Do return entity data
  })
```

Parse text with:

```
  parse({docs: ["My document"]})
```

Reset your parse with:

```
  reset()
```

Use the search results provided in the `isParsing` and `results` variables.

# References

This project was adapted from the following resources on the web:

- https://prateeksurana.me/blog/react-library-with-typescript/
- https://github.com/prateek3255/typescript-react-demo-library
- react hooks library
