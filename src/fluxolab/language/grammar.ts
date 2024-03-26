import * as ohm from "ohm-js";

import grammarContents from "./grammar.ohm";

const grammar = ohm.grammar(grammarContents);

export default grammar;
