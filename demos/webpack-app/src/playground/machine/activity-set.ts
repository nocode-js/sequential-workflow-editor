import { createActivitySet } from 'sequential-workflow-machine';
import { setStringValueActivity } from './activities/set-string-value-activity';
import { loopActivity } from './activities/loop-activity';
import { logActivity } from './activities/log-activity';
import { ifActivity } from './activities/if-activity';
import { calculateActivity } from './activities/calculate-activity';
import { convertValueActivity } from './activities/convert-value-activity';

export const activitySet = createActivitySet([
	calculateActivity,
	convertValueActivity,
	ifActivity,
	logActivity,
	loopActivity,
	setStringValueActivity
]);
