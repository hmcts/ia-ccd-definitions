export const imageLocators = {
  appealCompleted: {
      appealAllowed: {
          locator: '//*[@id="progress_pre_hearing_details_recorded_admin_decided_allowed"]/dt/ccd-markdown/div/markdown/p[1]/img',
          name: 'appeal_allowed',
      },
      appealDismissed: {
          locator: '//*[@id="progress_pre_hearing_details_recorded_admin_decided_dismissed"]/dt/ccd-markdown/div/markdown/p[1]/img',
          name: 'appeal_dismissed',
      },
  },
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
        },
        appellantInPersonManualS94b: {
            locator: '//*[@id="journey_type_aip_manual_s94b"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'appellant_in_person_manual_s94b',
        },
    },
    rehydrated: {
        detained: {
            representedManual: {
                locator: '//*[@id="journey_type_rehydrated_lr_manual_detained"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-LR-manual-Detained',
            },
            representedManualS94b: {
                locator: '//*[@id="journey_type_rehydrated_lr_manual_detained_s9"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-LR-manual-Detained-S9',
            },
            appellantInPersonManual: {
                locator: '//*[@id="journey_type_rehydrated_aip_manual_detained"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-AIP-manual-Detained',
            },
            appellantInPersonManualS94b: {
                locator: '//*[@id="journey_type_rehydrated_aip_manual_detained_s9"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-AIP-manual-Detained-S9',
            },
        },
        nonDetained: {
            representedManual: {
                locator: '//*[@id="journey_type_rehydrated_lr_manual"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-LR-manual',
            },
            representedManualS94b: {
                locator: '//*[@id="journey_type_rehydrated_lr_manual_s9"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-LR-manual-S9',
            },
            appellantInPersonManual: {
                locator: '//*[@id="journey_type_rehydrated_aip_manual"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-AIP-manual',
            },
            appellantInPersonManualS94b: {
                locator: '//*[@id="journey_type_rehydrated_aip_manual_s9"]/dt/ccd-markdown/div/markdown/p/img',
                name: 'Tag-Rehydrated-AIP-manual-S9',
            }
        },
        notifications: {
            locator: '//*[@id="notifications_turned_off_banner"]/dt/ccd-markdown/div/markdown/p/img',
            name: 'redydrate_turnoff',
        },
    },
};