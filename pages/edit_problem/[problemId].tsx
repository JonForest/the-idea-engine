import React from 'react'
import EditProblem from '../../components/problem_edit';
import { retrieveProblem } from '../../utils/data_connectivity';
import { Problem } from '../../utils/types';

interface EditProblemPageInterface {
  problem: Problem
}

export default function EditProblemPage({problem}: EditProblemPageInterface) {
  return <EditProblem problem={problem} />
}


export async function getServerSideProps(context) {
  const problem = await retrieveProblem(context.params.problemId)
  return {
    props: { problem }, // will be passed to the page component as props
  };
}