import {Page} from "@playwright/test";
import { PageHelper } from '../../helpers/PageHelper';
import {DecideFtpaApplication} from "./decideFtpaApplication";

export class ForceFtpaDecidedState {

    constructor(public page: Page) {
    }

    async submit(judgeDecision: string = 'allowed') {
        await new PageHelper(this.page).selectNextStep('Force FTPA decided state');
        await new DecideFtpaApplication(this.page).submit(judgeDecision == 'allowed' ? 'Respondent' : 'Appellant', true);
    };


}