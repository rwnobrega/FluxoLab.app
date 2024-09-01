import * as ohm from "ohm-js";

import grammarContents from "~/assets/grammar.ohm?raw";

const grammar = ohm.grammar(grammarContents);

export default grammar;
