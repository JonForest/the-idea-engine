import { useRouter } from 'next/router';
import React, { BaseSyntheticEvent, SyntheticEvent, useState } from 'react';
import EditProblem from '../components/problem_edit'

export default function NewProblemPage() {
  const router = useRouter()
  return <EditProblem problem={null} returnUrl="/"/>
}
