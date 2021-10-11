import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
//import * as kms from '@aws-cdk/aws-kms';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import {
  Peer,
  Port,
  SecurityGroup,
  Vpc,
} from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';
export class CodeCommit extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    //iam
	 const serviceRole = new iam.Role(this,
      'codebuild-ping-directory-service-role', { assumedBy: new iam.ServicePrincipal('sns.amazonaws.com') });
	   serviceRole.addToPolicy(new iam.PolicyStatement({
		   effect: iam.Effect.ALLOW,
      resources: ['*'],
      actions: ['*'],
    }));

    //vpc
    const vpc = new Vpc(this, 'VPC', {
      maxAzs: 3,
      natGateways: 3,
    });

    const ssh = new SecurityGroup(this, 'SSH-SG', {
      securityGroupName: 'open-ssh',
      vpc,
      allowAllOutbound: true,
    });

    ssh.addIngressRule(Peer.anyIpv4(), Port.tcp(22));
    ssh.addIngressRule(Peer.anyIpv6(), Port.tcp(22));
    //ssh.addIngressRule(ec2.Peer.ipv4('10.200.0.0/24'), ec2.Port.tcp(5439), 'Redshift Ingress1');
    //ssh.addIngressRule(ec2.Peer.ipv4('10.0.0.0/24'), ec2.Port.tcp(5439), 'Redshift Ingress2');


    //codecommit and codebuild
    // The code that defines your stack goes here
    const repository = new codecommit.Repository(this, 'MyRepo', { repositoryName: 'Ping-directory' });
    new codebuild.Project(this, 'Ping-directory-v7', {
      source: codebuild.Source.codeCommit({ repository }),
	  vpc: vpc,
	  //iam:serviceRole,

    });
    //pipeline
    const project = new codebuild.PipelineProject(this, 'ishita_pipeline');

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository,
      output: sourceOutput,
    });
    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()], // optional
      //executeBatchBuild: true, // optional, defaults to false
      // combineBatchBuildArtifacts: false, // optional, defaults to false
    });

    new codepipeline.Pipeline(this, 'MyPipeline', {
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        },
      ],
    });

  }

}

const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new cdk.App();

new CodeCommit(app, 'codecommit-dev-cdk-v7', { env: devEnv });
app.synth();
