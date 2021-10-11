const { AwsCdkConstructLibrary, NodePackageManager } = require('projen');
const project = new AwsCdkConstructLibrary({
  author: 'ishita',
  authorAddress: 'ishitasaxena78@yahoo.in',
  cdkVersion: '1.127.0',
  defaultReleaseBranch: 'main',
  name: 'v7',
  clobber: false,
  repositoryUrl: 'https://git-codecommit.us-west-2.amazonaws.com/v1/repos/check-in',
  cdkDependencies: ['@aws-cdk/core', '@aws-cdk/aws-codecommit', '@aws-cdk/aws-codebuild', '@aws-cdk/aws-codepipeline', '@aws-cdk/aws-codepipeline-actions', '@aws-cdk/aws-iam', '@aws-cdk/aws-ec2'],
  packageManager: NodePackageManager.NPM,
  github: false,
  docgen: true,
  eslint: true,

  // cdkDependencies: undefined,      /* Which AWS CDK modules (those that start with "@aws-cdk/") does this library require when consumed? */
  // cdkTestDependencies: undefined,  /* AWS CDK modules required for testing. */
  // deps: [],                        /* Runtime dependencies of this module. */
  // description: undefined,          /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                     /* Build dependencies for this module. */
  // packageName: undefined,          /* The "name" in package.json. */
  // release: undefined,              /* Add release management to this project. */
});

project.synth();