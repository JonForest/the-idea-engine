import React, {useState} from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import EditProblem from '../../components/problem_edit';
import { retrieveProblem } from '../../utils/data_connectivity';

export default function EditProblemPage() {
  const router = useRouter()
  const {data, error } = useSWR(router.query.problemId, retrieveProblem)
  return <EditProblem isLoading={!data} problem={data} />
}
