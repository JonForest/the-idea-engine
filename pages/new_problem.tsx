import { useRouter } from 'next/router';
import Link from 'next/link';
import React, { BaseSyntheticEvent, SyntheticEvent, useState } from 'react';
import Layout from '../components/layout';
import BufferedContent from '../components/buffered_content';
import { getToday, saveProblem } from '../utils/data_connectivity'
import EditProblem from '../components/problem_edit'

export default function NewProblemPage() {
  return <EditProblem problem={null} />
}
