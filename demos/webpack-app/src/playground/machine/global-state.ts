import { DynamicsService } from './services/dynamics-service';
import { LoggerService } from './services/logger-service';
import { VariableState, VariablesService } from './services/variables-service';

export interface GlobalState {
	startTime: Date;
	variablesState: VariableState;

	$variables: VariablesService;
	$dynamics: DynamicsService;
	$logger: LoggerService;
}
