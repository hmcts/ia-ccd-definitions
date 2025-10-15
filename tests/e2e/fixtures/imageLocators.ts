export const imageLocators = {
    detained: {
        representedS94b: {
            locator: '//*[@id="journey_type_legal_rep_detained_s9"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'legalRep_detained_s9',
        },
        represented: {
            locator: '//*[@id="journey_type_legal_rep_detained_appeal"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'legally_represented_detained_appeal',
        },
        appellantInPersonManual: {
            locator: '//*[@id="journey_type_aip_manual_detained"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'aipm_detained',
        },
        representedManual: {
            locator: '//*[@id="journey_type_legal_rep_manual_detained"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'legalRep_manual_detained',
        },
        representedManualS94b: {
            locator: '//*[@id="journey_type_legal_rep_manual_detained_s9"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'legalRep_manual_detained_s9',
        },
        appellantInPersonManualS94b: {
            locator: '//*[@id="journey_type_aip_manual_detained_s9"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'aipm_detained_s9',
        },
    },
    nonDetained: {
        representedManual: {
            locator: '//*[@id="journey_type_aip_legally_represented_manual"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'progress_legally_represented_overview_label',
        },
        represented: {
            locator: '//*[@id="journey_type_legal_rep"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'journey_type_legally_represented',
        },
        appellantInPersonManual: {
            locator: '//*[@id="journey_type_aip_manual"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'appellant_in_person_manual',
        }
    },
};