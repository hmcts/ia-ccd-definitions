package uk.gov.hmcts.reform.iacaseapi;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import uk.gov.hmcts.befta.BeftaMain;
import uk.gov.hmcts.befta.dse.ccd.CcdEnvironment;
import uk.gov.hmcts.befta.dse.ccd.CcdRoleConfig;
import uk.gov.hmcts.befta.dse.ccd.DataLoaderToDefinitionStore;
import uk.gov.hmcts.befta.exception.ImportException;
import uk.gov.hmcts.befta.util.BeftaUtils;

import javax.crypto.AEADBadTagException;
import javax.net.ssl.SSLException;
import java.util.List;
import java.util.Locale;

public class HighLevelDataSetupApp extends DataLoaderToDefinitionStore {

    private static final Logger logger = LoggerFactory.getLogger(HighLevelDataSetupApp.class);

    private static final CcdRoleConfig[] CCD_ROLES_NEEDED_FOR_IA = {
        new CcdRoleConfig("caseworker-ia-internal", "PUBLIC"),
        new CcdRoleConfig("caseworker-wa-task-configuration", "PUBLIC"),
        new CcdRoleConfig("citizen", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-legalrep-solicitor", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-system", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-rparobot", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-system-access", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-homeofficeapc", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-homeofficelart", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-homeofficepou", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-respondentofficer", "PUBLIC"),
        new CcdRoleConfig("caseworker-ia-iacjudge", "PUBLIC"),
        new CcdRoleConfig("caseworker-ras-validation", "PUBLIC"),
        new CcdRoleConfig("caseworker-caa", "PUBLIC"),
        new CcdRoleConfig("caseworker-approver", "PUBLIC"),
        new CcdRoleConfig("LEGALREPRESENTATIVE", "PUBLIC"),
        new CcdRoleConfig("CREATOR", "PUBLIC"),
        new CcdRoleConfig("hmcts-staff", "PUBLIC"),
        new CcdRoleConfig("hmcts-admin", "PUBLIC"),
        new CcdRoleConfig("hmcts-legal-operations", "PUBLIC"),
        new CcdRoleConfig("hmcts-ctsc", "PUBLIC"),
        new CcdRoleConfig("hmcts-judiciary", "PUBLIC"),
        new CcdRoleConfig("specific-access-judiciary", "PUBLIC"),
        new CcdRoleConfig("specific-access-legal-ops", "PUBLIC"),
        new CcdRoleConfig("specific-access-admin", "PUBLIC"),
        new CcdRoleConfig("specific-access-ctsc", "PUBLIC"),
        new CcdRoleConfig("tribunal-caseworker", "PUBLIC"),
        new CcdRoleConfig("senior-tribunal-caseworker", "PUBLIC"),
        new CcdRoleConfig("judge", "PUBLIC"),
        new CcdRoleConfig("senior-judge", "PUBLIC"),
        new CcdRoleConfig("leadership-judge", "PUBLIC"),
        new CcdRoleConfig("fee-paid-judge", "PUBLIC"),
        new CcdRoleConfig("lead-judge", "PUBLIC"),
        new CcdRoleConfig("hearing-judge", "PUBLIC"),
        new CcdRoleConfig("ftpa-judge", "PUBLIC"),
        new CcdRoleConfig("hearing-panel-judge", "PUBLIC"),
        new CcdRoleConfig("hearing-centre-admin", "PUBLIC"),
        new CcdRoleConfig("ctsc", "PUBLIC"),
        new CcdRoleConfig("ctsc-team-leader", "PUBLIC"),
        new CcdRoleConfig("national-business-centre", "PUBLIC"),
        new CcdRoleConfig("case-manager", "PUBLIC"),
        new CcdRoleConfig("case-allocator", "PUBLIC"),
        new CcdRoleConfig("task-supervisor", "PUBLIC"),
        new CcdRoleConfig("challenged-access-ctsc", "PUBLIC"),
        new CcdRoleConfig("challenged-access-legal-operations", "PUBLIC"),
        new CcdRoleConfig("challenged-access-admin", "PUBLIC"),
        new CcdRoleConfig("challenged-access-judiciary", "PUBLIC"),
        new CcdRoleConfig("next-hearing-date-admin", "PUBLIC"),

    };

    private final CcdEnvironment environment;

    public HighLevelDataSetupApp(CcdEnvironment dataSetupEnvironment) {
        super(dataSetupEnvironment);
        environment = dataSetupEnvironment;
    }

    public static void main(String[] args) throws Throwable {
        main(HighLevelDataSetupApp.class, args);
    }

    @Override
    public void addCcdRoles() {
        for (CcdRoleConfig roleConfig : CCD_ROLES_NEEDED_FOR_IA) {
            try {
                logger.info("\n\nAdding CCD Role {}.", roleConfig);
                addCcdRole(roleConfig);
                logger.info("\n\nAdded CCD Role {}.", roleConfig);
            } catch (Exception e) {
                logger.error("\n\nCouldn't add CCD Role {} - Exception: {}.\n\n", roleConfig, e);
                if (!shouldTolerateDataSetupFailure()) {
                    throw e;
                }
            }
        }
    }

    @Override
    protected List<String> getAllDefinitionFilesToLoadAt(String definitionsPath) {
        String environmentName = environment.name().toLowerCase(Locale.UK);
        //return List.of(String.format("build/ccd-release-config/civil-ccd-%s.xlsx", environmentName));
        return List.of(String.format("target/appeal/xlsx/ccd-appeal-config-aat.xlsx", environmentName));
    }

    @Override
    public void createRoleAssignments() {
        // Do not create role assignments.
        BeftaUtils.defaultLog("Will NOT create role assignments!");
    }

    @Override
    protected boolean shouldTolerateDataSetupFailure() {
        if (BeftaMain.getConfig().getDefinitionStoreUrl().contains(".preview.")) {
            return true;
        }
        return false;
    }

    @Override
    protected boolean shouldTolerateDataSetupFailure(Throwable e) {
        int httpStatusCode504 = 504;
        if (e instanceof ImportException) {
            ImportException importException = (ImportException) e;
            return importException.getHttpStatusCode() == httpStatusCode504;
        }
        if (e instanceof SSLException) {
            return true;
        }
        if (e instanceof AEADBadTagException) {
            return true;
        }
        return shouldTolerateDataSetupFailure();
    }
}
