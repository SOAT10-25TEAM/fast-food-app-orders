# POS Tech - FIAP SOAT10 - Fase 3 - Apresentação

**Turma:**

- Danilo S. | RM360100
- Douglas B. | RM360378
- Jaqueline M.P.S. | RM359838
- Skawinki | RM359870

---
## Ambiente de Rede do EKS:
A VPC é a rede virtual privada onde todos os recursos da AWS são implantados. 
Ela funciona como um datacenter isolado dentro da nuvem da AWS, permitindo que você defina endereços IP,
sub-redes públicas ou privadas, tabelas de roteamento e gateways. 

Para o nosso projeto temos nossa sub-rede privada tem apenas um bloco CIDR pequeno (10.0.0.0/24), ideal para testes, garantindo controle sobre
o tráfego de rede. Dessa forma conseguimos garantir uma arquitetura com maior segurança, não expondo os dados do nosso ambiente para a internet. 
Esses recursos se comunicam com a internet através do nosso NAT gateway, que está configurado em nossa subnet pública.


## NAT Gateway
O NAT Gateway permite que instâncias em subnets privadas façam requisições
para a internet (como baixar atualizações ou imagens de contêineres), 
mas impede conexões iniciadas da internet para essas instâncias. Ele é implantado em uma subnet pública e atua
como intermediário seguro entre a rede privada e a internet.

## EKS Cluster
O Amazon EKS (Elastic Kubernetes Service) é o serviço gerenciado da AWS para orquestração de 
contêineres com Kubernetes. Ele gerencia o plano de controle (control plane), incluindo o API Server, etcd,
 scheduler e controller manager, permitindo que você foque na implantação e gerenciamento de aplicações em
 contêineres sem se preocupar com a infraestrutura subjacente.

## Node Group
O Node Group é um conjunto de instâncias EC2 que atuam como nós de trabalho (workers) no cluster Kubernetes. 
Eles executam os pods e serviços definidos nos manifests do Kubernetes. O EKS gerencia automaticamente o provisionamento, 
escalonamento e substituição dessas instâncias, garantindo alta disponibilidade e desempenho.

## Security Group
O Security Group funciona como um firewall virtual que controla o tráfego de entrada e saída dos recursos da AWS. 
No contexto do EKS, ele é usado para proteger o cluster e os nós, permitindo apenas comunicações autorizadas, como 
o tráfego interno entre nós e o plano de controle, ou o acesso externo ao API Server.

## Logs
Os logs do cluster EKS são enviados para o Amazon CloudWatch e incluem informações cruciais como chamadas de API,
eventos de autenticação, decisões do scheduler e ações dos controladores. Habilitar esses logs é essencial para auditoria,
monitoramento e solução de problemas, especialmente em ambientes de produção ou quando se deseja entender o comportamento do cluster.
 
## Lambda
A função Lambda na AWS é um serviço de computação serverless, ou seja, você executa código sem precisar gerenciar servidores.
Basta escrever sua função, definir os gatilhos (eventos que disparam a execução) e a AWS cuida do resto — como provisionamento, 
escalabilidade e disponibilidade.

## AWS Organizations
O AWS Organizations é um serviço que permite gerenciar várias contas da AWS de forma centralizada,
ideal para empresas que desejam separar ambientes como produção, desenvolvimento e financeiro, oferecendo recursos 
como consolidação de faturamento, aplicação de políticas de controle (SCPs) para restringir ou permitir ações específicas, 
criação de unidades organizacionais (OUs) para estruturar contas hierarquicamente, além de facilitar a governança, automação
e segurança em larga escala, com integração a serviços como AWS Control Tower, Config e CloudTrail

## IAM
O AWS IAM (Identity and Access Management) é o serviço da AWS que permite controlar de forma segura o 
acesso aos recursos da nuvem, definindo quem pode fazer o quê, em quais recursos e sob quais condições. 
Com o IAM, você pode criar usuários, grupos, funções e políticas para gerenciar permissões de forma granular. 
Para o nosso ambiente aplicamos o princípio de menor privilégio, onde os nossos desenvolvedores tem apenas o acesso necessário.
 
## Cloudtrail
O AWS CloudTrail é um serviço que permite registrar, monitorar e auditar todas as ações realizadas na conta da AWS, 
fornecendo um histórico detalhado de chamadas de API feitas por usuários, serviços ou aplicações. Ele registra eventos como criação,
 modificação ou exclusão de recursos, ajudando na detecção de atividades suspeitas, investigações de segurança e conformidade com auditorias. 


## Guarddutty
O Amazon GuardDuty é um serviço gerenciado de detecção inteligente de ameaças da AWS que monitora continuamente nossas contas,
workloads e dados para identificar atividades maliciosas ou comportamentos não autorizados. Ele analisa fontes como logs do CloudTrail, 
registros de fluxo da VPC e consultas DNS, utilizando inteligência de ameaças, machine learning e análise comportamental para detectar sinais 
de comprometimento, como uso de credenciais roubadas, mineração de criptomoedas, malware em instâncias EC2 ou acessos suspeitos ao S3. 
O GuardDuty fornece alertas detalhados (chamados de findings) que ajudam a responder rapidamente a incidentes de segurança sem a necessidade
de configurar ou manter infraestrutura adicional. Ativamos esse recurso para garantirmos as melhores práticas de segurança baseado no AWS 
Well-Architected Framework é um conjunto de boas práticas criado pela Amazon Web Services para ajudar arquitetos de nuvem a projetar,
construir e manter sistemas seguros, resilientes, eficientes e otimizados na nuvem.

 
## Amazon RDS
O Amazon RDS for MySQL é um serviço gerenciado da AWS que permite criar, operar e escalar bancos de dados MySQL na nuvem com facilidade, 
oferecendo backups automáticos, atualizações de software, monitoramento e alta disponibilidade. Para o nosso projeto, escolhemos o cluster do RDS com o tamanho "db.t3.micro",
uma instância com 1GB de memória e duas vCPUS. 

Neste primeiro momento não configuramos o Multi-AZ, ele permite que é uma configuração de alta disponibilidade que 
replica automaticamente os dados do banco de dados principal para uma instância de standby em uma zona de disponibilidade 
diferente (AZ) dentro da mesma região da AWS. Essa réplica é mantida em sincronia com a instância principal, mas não é usada
para leitura ou escrita — ela serve exclusivamente como backup em caso de falha. Se ocorrer uma falha de hardware, problema de 
rede ou manutenção planejada na instância principal, o RDS realiza automaticamente um failover para a instância de standby, minimizando
o tempo de inatividade sem necessidade de intervenção manual.
Além disso, se tivermos problemas de carga em nossa instância, podemos implementar a Read Replica no Amazon RDS, que é cópia assíncrona 
somente leitura de uma instância principal de banco de dados. Ela é usada principalmente para escalar operações de 
leitura e aliviar a carga da instância principal, melhorando o desempenho de aplicações com muitas consultas.

Para otimização de custos no nosso ambiente, utilizamos as melhores práticas do Finops Foundation, tagueando os nossos recursos e 
adicionando compute Savings Plans, que é um modelo de precificação que permite economizar até 72% em comparação 
com o uso sob demanda, em troca de um compromisso de uso contínuo (em dólares por hora) por um período de 1 ou 3 anos. 
Ele é mais flexível que as Reserved Instances e se aplica automaticamente aos serviços compatíveis.Essa reserva irá 
funcionar para o nosso ambiente de EKS e para nossas funções lambda.

Para o nosso ambiente do RDS, utilizamos o Reserved Instance (RI) do Amazon RDS, que é uma forma de obter descontos significativos (até 69%)
em comparação com o preço sob demanda, ao se comprometer com o uso de uma instância de banco de dados por um período de 1 ou 3 anos.
