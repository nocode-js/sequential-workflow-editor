import { createActivitySet } from 'sequential-workflow-machine';
import { setStringValueActivity } from './activities/set-string-value-activity';
import { loopActivity } from './activities/loop-activity';
import { logActivity } from './activities/log-activity';
import { dumpVariablesActivity } from './activities/dump-variables-activity';

export const activitySet = createActivitySet([dumpVariablesActivity, logActivity, loopActivity, setStringValueActivity]);
