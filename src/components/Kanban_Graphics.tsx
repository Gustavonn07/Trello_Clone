import { useEffect, useState } from "react";
import { Column, Task } from "../types";
import { getColors } from "../utils/getColors";
import { getDateInfo } from "../utils/getDateInfo";
import Chart_Bar from "./chart/Chart_Bar";
import Chart_Pie from "./chart/Chart_Pie";
import Close_Icon from "./icons/Close_Icon";

interface Props {
    setOpenGraphicsModal: (openGraphicsModal: boolean) => void;
    columns: Column[];
    tasks: Task[];
}

function Kanban_Graphics({ setOpenGraphicsModal, columns, tasks }: Props) {
    
    const months = new getDateInfo().getMonthsNames();
    // PASSAR ISSO -----------------------------------------------------------------------------------------------------------------
    const initialTasksPerMonth = () => {
        const savedTasksPerMonth = localStorage.getItem('tasksPerMonth');
        if (savedTasksPerMonth) {
            return JSON.parse(savedTasksPerMonth);
        }
        return new Array(months.length).fill(0);
    };

    const [tasksPerMonth, setTasksPerMonth] = useState<number[]>(initialTasksPerMonth);

    useEffect(() => {
        const newTasksCountByMonth = months.map((_, index) =>
            tasks.filter(task => {
                const taskMonth = new Date(task.createdAt).getMonth();
                return taskMonth === index;
            }).length
        );

        setTasksPerMonth(prevTasksPerMonth => {
            const updatedTasksPerMonth = prevTasksPerMonth.map((_, index) =>
                newTasksCountByMonth[index] > prevTasksPerMonth[index] ? newTasksCountByMonth[index] : prevTasksPerMonth[index]
            );

            updatedTasksPerMonth[new getDateInfo().getMonthNumber() - 1] += 1;

            localStorage.setItem('tasksPerMonth', JSON.stringify(updatedTasksPerMonth));

            return updatedTasksPerMonth;
        });
    }, [tasks]);
    // ATÉ ISSO --------------------------------------------------------------------------------------------------------------------
    // PARA FORA DO ABRIR O MODAL, POIS SEMPRE QUE O MODAL EH ABERTO O USEEFFECT EH ATIVADO, MAS O USEEFFECT DEVERIA SER TROCADO APENAS QUANDO AS TASKS MUDAM
    
    const tasksByColumn = columns.map(column => {
        const count = tasks.filter(task => task.columnId === column.id).length;
        return { label: column.title, count };
    });

    const pieLabels = tasksByColumn.map(item => item.label);
    const pieData = tasksByColumn.map(item => item.count);
    const colors = getColors(pieLabels.length);
    return (
        <section 
            onClick={() => setOpenGraphicsModal(false)}
            className="absolute left-0 w-full h-screen flex justify-center items-center bg-[#00000080]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-10/12 relative stroke-2 h-[90vh] rounded shadow-md shadow-[#00000060] bg-mainBackgroundColor"
            >
                <button 
                    onClick={() => setOpenGraphicsModal(false)}
                    className="absolute top-4 right-6 hover:bg-rose-500 rounded cursor-pointer duration-150"
                >
                    <Close_Icon/>
                </button>
                <ul className="flex gap-5 px-5 overflow-hidden items-center h-full">
                    <li className="w-1/2 h-5/6">
                    <h2 className="flex justify-center items-center w-full py-3 text-4xl font-semibold">Tasks per columns</h2>
                        <Chart_Pie
                            labels={pieLabels}
                            dataLabels={pieData}
                            colors={colors}
                        />
                    </li>
                    <li className="w-1/2 h-5/6 flex flex-col justify-between items-center bg-gray-200 rounded-md p-8 shadow-xl shadow-[#00000090]">
                    <h2 className="flex justify-center items-center w-full text-4xl text-mainBackgroundColor font-semibold">Tasks per month</h2>
                        <Chart_Bar
                            labels={months}
                            dataLabels={tasksPerMonth}
                            colors={colors}
                        />
                    </li>
                </ul>
            </div>
        </section>
    )
}

export default Kanban_Graphics