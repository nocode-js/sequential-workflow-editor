import { SimpleEvent } from 'sequential-workflow-editor-model';

export class LoggerService {
	public readonly onLog = new SimpleEvent<string>();

	public log(message: string) {
		this.onLog.forward(message);
	}
}
