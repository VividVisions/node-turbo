
import * as chaiModule from 'chai';
import chaiSpies from 'chai-spies';

const chai = chaiModule.use(chaiSpies);

export default chai;
export const { spy, expect } = chai;
